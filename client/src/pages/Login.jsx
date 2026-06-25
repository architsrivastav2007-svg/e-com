import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import FormError from '../components/FormError.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

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
      await login(formData);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (requestError) {
      setServerError(requestError?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Welcome back</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Login to your account</h1>
          <p className="max-w-xl text-slate-600">Sign in to continue shopping, manage your profile, and access your cart.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="space-y-5">
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
            />
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
            />
            <FormError message={serverError} />
            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </div>
          <p className="mt-5 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-slate-900 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
