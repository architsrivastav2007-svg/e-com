const ToastMessage = ({ message, type = 'success' }) => {
  if (!message) {
    return null;
  }

  const variantClass =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700 shadow-red-200/40'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-200/40';

  return (
    <div className={`fixed right-4 top-24 z-[60] rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl ${variantClass}`}>
      {message}
    </div>
  );
};

export default ToastMessage;
