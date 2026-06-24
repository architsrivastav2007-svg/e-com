const ProductPrice = ({ price, rating, stock }) => {
  const inStock = Number(stock) > 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Price</p>
          <p className="mt-2 text-4xl font-black tracking-tight">${Number(price).toFixed(2)}</p>
        </div>
        <span
          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
            inStock ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}
        >
          {inStock ? `${stock} in stock` : 'Out of Stock'}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3 text-sm text-slate-200">
        <span className="font-semibold text-white">Rating:</span>
        <span>{Number(rating ?? 0).toFixed(1)} / 5</span>
      </div>
    </div>
  );
};

export default ProductPrice;
