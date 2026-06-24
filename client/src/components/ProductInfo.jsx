const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {product.category}
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{product.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
          {product.brand ? <span>Brand: <span className="font-semibold text-slate-900">{product.brand}</span></span> : null}
          <span>Reviews: <span className="font-semibold text-slate-900">{product.numReviews ?? 0}</span></span>
        </div>
      </div>

      <p className="max-w-3xl text-base leading-8 text-slate-600">{product.description}</p>
    </div>
  );
};

export default ProductInfo;
