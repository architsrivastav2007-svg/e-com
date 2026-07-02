import { useEffect, useState } from 'react';
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx';
import ToastMessage from '../../components/ToastMessage.jsx';
import { TableSkeleton } from '../../components/admin/AdminSkeletons.jsx';
import { getAdminOrders, updateAdminOrder } from '../../services/adminService.js';

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [savingId, setSavingId] = useState('');
  const [statusDrafts, setStatusDrafts] = useState({});

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminOrders({ page: 1, limit: 50 });
      const nextOrders = data?.orders ?? [];
      setOrders(nextOrders);
      setStatusDrafts(
        nextOrders.reduce((drafts, order) => {
          drafts[order._id] = order.orderStatus;
          return drafts;
        }, {}),
      );
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = (orderId, value) => {
    setStatusDrafts((current) => ({ ...current, [orderId]: value }));
  };

  const handleSave = async (orderId) => {
    try {
      setSavingId(orderId);
      const data = await updateAdminOrder(orderId, { orderStatus: statusDrafts[orderId] });
      setToast({ message: data?.message || 'Order updated successfully', type: 'success' });
      await loadOrders();
    } catch (requestError) {
      setToast({ message: requestError?.response?.data?.message || requestError?.message || 'Failed to update order', type: 'error' });
    } finally {
      setSavingId('');
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));

  return (
    <div className="space-y-6">
      <ToastMessage message={toast.message} type={toast.type} />

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Orders</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Order management</h1>
        <p className="mt-2 text-slate-600">Update fulfillment status for every order in the system.</p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : error ? (
        <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-6 py-12 text-center text-rose-700">{error}</div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-4 font-semibold">Customer</th>
                  <th className="px-4 py-4 font-semibold">Order Total</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Date</th>
                  <th className="px-4 py-4 font-semibold">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orders.length ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900">{order.customerName}</p>
                        <p className="mt-1 text-sm text-slate-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(order.totalPrice)}</td>
                      <td className="px-4 py-4"><OrderStatusBadge status={order.orderStatus} /></td>
                      <td className="px-4 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2 sm:flex-row">
                          <select
                            value={statusDrafts[order._id] || order.orderStatus}
                            onChange={(event) => handleStatusChange(order._id, event.target.value)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-900"
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleSave(order._id)}
                            disabled={savingId === order._id || statusDrafts[order._id] === order.orderStatus}
                            className="rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            {savingId === order._id ? 'Saving...' : 'Update'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center text-slate-500">
                      No orders available.
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

export default AdminOrders;