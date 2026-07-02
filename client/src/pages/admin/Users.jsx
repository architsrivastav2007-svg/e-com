import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import ToastMessage from '../../components/ToastMessage.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { TableSkeleton } from '../../components/admin/AdminSkeletons.jsx';
import { deleteAdminUser, getAdminUsers, updateAdminUser } from '../../services/adminService.js';

const roles = ['user', 'admin'];

const AdminUsers = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [confirmUser, setConfirmUser] = useState(null);
  const [roleDrafts, setRoleDrafts] = useState({});

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminUsers({ page: 1, limit: 50, search: debouncedSearchTerm.trim() || undefined });
      const nextUsers = data?.users ?? [];
      setUsers(nextUsers);
      setRoleDrafts(
        nextUsers.reduce((drafts, currentUser) => {
          drafts[currentUser._id] = currentUser.role;
          return drafts;
        }, {}),
      );
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = (userId, value) => {
    setRoleDrafts((current) => ({ ...current, [userId]: value }));
  };

  const handleRoleSave = async (userId) => {
    try {
      setSavingId(userId);
      const data = await updateAdminUser(userId, { role: roleDrafts[userId] });
      setToast({ message: data?.message || 'User updated successfully', type: 'success' });
      await loadUsers();
    } catch (requestError) {
      setToast({ message: requestError?.response?.data?.message || requestError?.message || 'Failed to update user', type: 'error' });
    } finally {
      setSavingId('');
    }
  };

  const handleDelete = async () => {
    if (!confirmUser) return;

    try {
      setDeletingId(confirmUser._id);
      const data = await deleteAdminUser(confirmUser._id);
      setToast({ message: data?.message || 'User deleted successfully', type: 'success' });
      setConfirmUser(null);
      await loadUsers();
    } catch (requestError) {
      setToast({ message: requestError?.response?.data?.message || requestError?.message || 'Failed to delete user', type: 'error' });
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="space-y-6">
      <ToastMessage message={toast.message} type={toast.type} />
      <ConfirmDialog
        open={Boolean(confirmUser)}
        title="Delete user"
        description={`Delete ${confirmUser?.name || 'this user'}? This action is permanent.`}
        confirmLabel="Delete user"
        loading={deletingId === confirmUser?._id}
        onConfirm={handleDelete}
        onCancel={() => setConfirmUser(null)}
      />

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Users</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">User administration</h1>
        <p className="mt-2 text-slate-600">Update roles and remove accounts, while keeping your own account protected.</p>

        <label className="mt-5 block max-w-md">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Search</span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
          />
        </label>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={4} />
      ) : error ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-12 text-center text-rose-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Name</th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Role</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.length ? (
                  users.map((currentUser) => {
                    const isSelf = currentUser._id === authUser?._id;

                    return (
                      <tr key={currentUser._id}>
                        <td className="px-4 py-4 font-semibold text-slate-900">{currentUser.name}</td>
                        <td className="px-4 py-4 text-slate-600">{currentUser.email}</td>
                        <td className="px-4 py-4">
                          <select
                            value={roleDrafts[currentUser._id] || currentUser.role}
                            onChange={(event) => handleRoleChange(currentUser._id, event.target.value)}
                            disabled={isSelf}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleRoleSave(currentUser._id)}
                              disabled={isSelf || savingId === currentUser._id || roleDrafts[currentUser._id] === currentUser.role}
                              className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                              {savingId === currentUser._id ? 'Saving...' : 'Save Role'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmUser(currentUser)}
                              disabled={isSelf}
                              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isSelf ? 'Current User' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;