const Button = ({ children, className = '', loading = false, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${
        loading ? 'bg-slate-500' : 'bg-slate-900 hover:bg-slate-700'
      } ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
