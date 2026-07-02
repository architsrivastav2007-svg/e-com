import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated) {
      return;
    }

    navigate(user?.role === 'admin' ? '/admin/dashboard' : '/home', { replace: true });
  }, [authLoading, isAuthenticated, navigate, user?.role]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    if (!formData.password.trim()) nextErrors.password = 'Password is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) return;

    try {
      setLoading(true);
      const data = await login(formData);
      const nextPath = data?.user?.role === 'admin' ? '/admin/dashboard' : location.state?.from?.pathname || '/home';
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setServerError(requestError?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-8rem] h-80 w-80 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-6rem] h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="mb-8 flex items-center gap-3 text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f1426] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <FaShoppingBag className="text-lg text-white" />
          </span>
          <span>
            <span className="block text-3xl font-black tracking-tight sm:text-4xl">
              Shop<span className="text-amber-400">Sphere</span>
            </span>
          </span>
        </Link>

        <section className="w-full max-w-md rounded-[2rem] border border-white/8 bg-white/6 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-8">
          <div className="mb-8 text-center">
            <p className="text-3xl font-black tracking-tight text-white">Welcome back</p>
            <p className="mt-2 text-sm text-white/35">Sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-3 block text-sm font-semibold text-white/55">Email</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border bg-[#111111] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/18 focus:border-amber-400 ${
                  errors.email ? 'border-rose-500/60' : 'border-white/10'
                }`}
              />
              {errors.email ? <span className="mt-2 block text-xs font-medium text-rose-400">{errors.email}</span> : null}
            </label>

            <label className="block">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-white/55">Password</span>
                <Link to="/register" className="font-semibold text-amber-400 transition hover:text-amber-300">
                  Forgot?
                </Link>
              </div>
              <div className={`flex items-center rounded-2xl border bg-[#111111] px-4 py-3 transition focus-within:border-amber-400 ${errors.password ? 'border-rose-500/60' : 'border-white/10'}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/18"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="ml-3 text-white/35 transition hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password ? <span className="mt-2 block text-xs font-medium text-rose-400">{errors.password}</span> : null}
            </label>

            {serverError ? <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{serverError}</div> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-2xl bg-amber-400 px-5 py-3.5 text-base font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-200"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/30">
            New to ShopSphere?{' '}
            <Link to="/register" className="font-semibold text-amber-400 transition hover:text-amber-300">
              Create one
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
