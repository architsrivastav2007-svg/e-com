const ErrorMessage = ({ message }) => {
  return (
    <div className="rounded-2xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm font-medium text-red-400">
      {message}
    </div>
  );
};

export default ErrorMessage;
