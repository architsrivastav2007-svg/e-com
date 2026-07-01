import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import InputField from '../components/InputField.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import FormError from '../components/FormError.jsx';
import { getMyProfile, updateMyProfile } from '../services/userService.js';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshAuth } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getMyProfile();
        const currentUser = data?.user || user;

        setProfile({
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          password: '',
        });
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!profile.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!profile.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError('Enter a valid email address');
      return false;
    }

    if (profile.password && profile.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: profile.name,
        email: profile.email,
      };

      if (profile.password.trim()) {
        payload.password = profile.password;
      }

      const data = await updateMyProfile(payload);
      setSuccess(data?.message || 'Profile updated successfully');

      if (profile.password.trim() || data?.passwordUpdated) {
        logout();
        navigate('/login', { replace: true });
        return;
      }

      await refreshAuth();
      setProfile((current) => ({ ...current, password: '' }));
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Profile</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Manage your account</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-3xl font-black text-slate-500">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">{user?.name || 'User'}</h2>
              <p className="text-sm text-slate-600">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Email</span><span className="text-right">{user?.email || '-'}</span></p>
            <p className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Join Date</span><span>{joinDate}</span></p>
          </div>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Profile Form</h2>
            <p className="text-slate-600">Update your name, email, or password. Changing your password will log you out for security.</p>
          </div>

          {loading ? <div className="mb-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">Loading profile...</div> : null}
          <FormError message={error} />
          {!error && success ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div> : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField label="Name" name="name" value={profile.name} onChange={handleChange} placeholder="Your name" />
            <InputField label="Email" type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Your email" />
            <PasswordInput
              label="Password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" loading={saving} className="w-full sm:w-auto">
              Save Button
            </Button>
            <p className="text-sm text-slate-500">After changing your password, you will be redirected to login again.</p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
