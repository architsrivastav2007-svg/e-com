const RelatedInfo = ({ product }) => {
  const inStock = Number(product.stock) > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Category</p>
        <p className="mt-2 text-lg font-bold text-slate-950">{product.category}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Brand</p>
        <p className="mt-2 text-lg font-bold text-slate-950">{product.brand || 'N/A'}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Availability</p>
        <p className={`mt-2 text-lg font-bold ${inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
          {inStock ? `${product.stock} available` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
};

export default RelatedInfo;
