const RelatedInfo = ({ product }) => {
  const inStock = Number(product.stock) > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-5 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b26f]/70">Category</p>
        <p className="mt-2 text-lg font-bold text-white">{product.category}</p>
      </div>
      <div className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-5 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b26f]/70">Brand</p>
        <p className="mt-2 text-lg font-bold text-white">{product.brand || 'N/A'}</p>
      </div>
      <div className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-5 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b26f]/70">Availability</p>
        <p className={`mt-2 text-lg font-bold ${inStock ? 'text-emerald-400' : 'text-rose-400'}`}>
          {inStock ? `${product.stock} available` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
};

export default RelatedInfo;
