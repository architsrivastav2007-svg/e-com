import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ label, error, className = '', ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="relative">
        <input
          {...props}
          type={visible ? 'text' : 'password'}
          className={`w-full rounded-2xl border px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 ${
            error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-slate-900"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error ? <span className="mt-2 block text-sm font-medium text-red-600">{error}</span> : null}
    </label>
  );
};

export default PasswordInput;
