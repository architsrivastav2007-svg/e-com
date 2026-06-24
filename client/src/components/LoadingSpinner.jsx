const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" aria-label="Loading" />
    </div>
  );
};

export default LoadingSpinner;
