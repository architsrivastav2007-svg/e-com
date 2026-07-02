const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-900 border-t-[#d4b26f]" aria-label="Loading" />
    </div>
  );
};

export default LoadingSpinner;
