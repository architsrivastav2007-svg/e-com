const InputField = ({ label, error, className = '', ...props }) => {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">{label}</span>
      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-3 text-xs text-white outline-none transition placeholder:text-neutral-600 focus:border-[#d4b26f]/60 ${
          error 
            ? 'border-red-900/40 bg-red-950/20' 
            : 'border-neutral-900 bg-neutral-950'
        }`}
      />
      {error ? <span className="mt-2 block text-xs font-semibold text-red-400">{error}</span> : null}
    </label>
  );
};

export default InputField;
