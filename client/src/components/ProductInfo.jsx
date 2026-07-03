const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-neutral-900/60 text-[#d4b26f] border border-[#d4b26f]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-luxury-sans">{product.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-450">
          {product.brand ? <span>Brand: <span className="font-semibold text-neutral-200">{product.brand}</span></span> : null}
          <span>Reviews: <span className="font-semibold text-neutral-200">{product.numReviews ?? 0}</span></span>
        </div>
      </div>

      <p className="max-w-3xl text-sm leading-8 text-neutral-400">{product.description}</p>
    </div>
  );
};

export default ProductInfo;
