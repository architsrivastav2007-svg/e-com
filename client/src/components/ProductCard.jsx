import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const firstImage = product?.images?.[0];
  const inStock = Number(product?.stock) > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.title}
            className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-60 items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-sm font-semibold text-slate-500">
            No Image Available
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1 space-y-3">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {product.category}
          </span>

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-slate-950">{product.title}</h3>
            <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1 font-semibold text-slate-900">
              <FaStar className="text-amber-500" />
              <span>{Number(product.rating ?? 0).toFixed(1)}</span>
            </div>
            <span>
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-2xl font-black tracking-tight text-slate-950">${Number(product.price).toFixed(2)}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {inStock ? 'Available' : 'Sold out'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to={`/products/${product._id}`}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              View Details
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
