const InputField = ({ label, error, className = '', ...props }) => {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 ${
          error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'
        }`}
      />
      {error ? <span className="mt-2 block text-sm font-medium text-red-600">{error}</span> : null}
    </label>
  );
};

export default InputField;
