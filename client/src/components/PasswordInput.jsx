import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ label, error, className = '', ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</span>
      <div className="relative">
        <input
          {...props}
          type={visible ? 'text' : 'password'}
          className={`w-full rounded-xl border px-4 py-3 pr-12 text-xs text-white outline-none transition placeholder:text-neutral-600 focus:border-[#d4b26f]/60 ${
            error 
              ? 'border-red-900/40 bg-red-950/20' 
              : 'border-neutral-900 bg-neutral-950'
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500 transition hover:text-white"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      {error ? <span className="mt-2 block text-xs font-semibold text-red-400">{error}</span> : null}
    </label>
  );
};

export default PasswordInput;
