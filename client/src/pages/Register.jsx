import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import FormError from '../components/FormError.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Enter a valid email';
    if (!formData.password.trim()) nextErrors.password = 'Password is required';
    if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';

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
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate('/', { replace: true });
    } catch (requestError) {
      setServerError(requestError?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b26f]">Create account</p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-luxury-sans">Register for faster checkout</h1>
          <p className="max-w-xl text-neutral-400">Create your account to save orders, use your cart across sessions, and personalize shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-neutral-900 bg-[#0b0b0b]/60 p-8 shadow-2xl backdrop-blur-md">
          <div className="space-y-5">
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" error={errors.name} />
            <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} />
            <PasswordInput label="Password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" error={errors.password} />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={errors.confirmPassword}
            />
            <FormError message={serverError} />
            <Button type="submit" loading={loading} className="w-full">
              Register
            </Button>
          </div>
          <p className="mt-5 text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#d4b26f] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
