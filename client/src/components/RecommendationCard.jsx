import { Link } from 'react-router-dom';

const RecommendationCard = ({ product }) => {
  const image = product.images?.[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {image ? (
          <img src={image} alt={product.title} className="h-44 w-full object-cover transition duration-300 hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-sm font-semibold text-slate-500">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1 space-y-2">
          <h3 className="line-clamp-2 text-base font-bold tracking-tight text-slate-950">{product.title}</h3>
          <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">${Number(product.price || 0).toFixed(2)}</span>
            <span>Rating {Number(product.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <Link
          to={`/products/${product._id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default RecommendationCard;
