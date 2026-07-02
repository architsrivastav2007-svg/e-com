import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaMapMarkerAlt, FaSlidersH, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyProfile, updateMyProfile } from '../services/userService.js';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, refreshAuth } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const splitName = (fullName) => {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return { firstName: '', lastName: '' };
    }

    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }

    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  };

  const { firstName, lastName } = useMemo(() => splitName(profile.name), [profile.name]);

  const updateFirstName = (value) => {
    const nextFirstName = value.trimStart();
    setProfile((current) => {
      const existingParts = String(current.name || '').trim().split(/\s+/).filter(Boolean);
      const nextLastName = existingParts.length > 1 ? existingParts.slice(1).join(' ') : lastName;
      return {
        ...current,
        name: [nextFirstName, nextLastName].filter(Boolean).join(' ').trim(),
      };
    });
  };

  const updateLastName = (value) => {
    const nextLastName = value.trimStart();
    setProfile((current) => {
      const existingParts = String(current.name || '').trim().split(/\s+/).filter(Boolean);
      const nextFirst = existingParts[0] || firstName;
      return {
        ...current,
        name: [nextFirst, nextLastName].filter(Boolean).join(' ').trim(),
      };
    });
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
  const displayName = user?.name || 'Your account';
  const displayEmail = user?.email || 'your@email.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/8 bg-[#0e0e0e] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a15d] text-2xl font-black text-[#111111] shadow-lg shadow-black/20">
                  {initials}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-white">{displayName}</h1>
                  <p className="text-sm text-white/45">{displayEmail}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {[
                  { icon: FaUserCircle, label: 'Profile', active: true },
                  { icon: FaMapMarkerAlt, label: 'Address', active: false },
                  { icon: FaSlidersH, label: 'Settings', active: false },
                ].map(({ icon: Icon, label, active }) => (
                  <button
                    key={label}
                    type="button"
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? 'border-[#c9a15d]/40 bg-[#1b1b1b] text-[#c9a15d]'
                        : 'border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="shrink-0" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/8 bg-[#111111] p-4 text-sm text-white/55">
                <p className="flex justify-between gap-3">
                  <span className="font-semibold text-white/85">Email</span>
                  <span className="text-right text-white/65">{displayEmail}</span>
                </p>
                <p className="mt-3 flex justify-between gap-3">
                  <span className="font-semibold text-white/85">Join Date</span>
                  <span className="text-right text-white/65">{joinDate}</span>
                </p>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/30">Account</p>
                <h2 className="mt-2 text-4xl font-black tracking-tight text-white">Profile Information</h2>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white/75 transition hover:border-[#c9a15d]/40 hover:text-[#c9a15d]"
              >
                Sign Out
              </button>
            </div>

            <section className="rounded-[2rem] border border-white/8 bg-[#141414] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)] sm:p-8">
              {loading ? <div className="mb-6 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/45">Loading profile...</div> : null}
              {error ? <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200">{error}</div> : null}
              {!error && success ? (
                <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
                  <span className="inline-flex items-center gap-2"><FaCheck /> {success}</span>
                </div>
              ) : null}

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/55">First Name</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => updateFirstName(event.target.value)}
                    placeholder="First name"
                    className="w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/18 focus:border-[#c9a15d]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/55">Last Name</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => updateLastName(event.target.value)}
                    placeholder="Last name"
                    className="w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/18 focus:border-[#c9a15d]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/55">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/18 focus:border-[#c9a15d]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/55">Password</span>
                  <div className="flex items-center rounded-2xl border border-white/8 bg-[#1b1b1b] px-4 py-3 transition focus-within:border-[#c9a15d]">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={profile.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/18"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="ml-3 text-white/35 transition hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </label>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#c9a15d] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#d8b56f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <p className="text-sm text-white/35">Updating your password will log you out after saving.</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
