const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  const filtered = [...pages].filter((page) => page > 0 && page <= totalPages);
  filtered.sort((left, right) => left - right);

  return filtered;
};

const ProductsPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`min-w-11 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            page === currentPage
              ? 'bg-slate-900 text-white shadow-lg'
              : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default ProductsPagination;
