import { Link } from 'react-router-dom';

const RecommendationCard = ({ product }) => {
  const image = product.images?.[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-900 bg-[#0e0e0e] shadow-2xl transition hover:-translate-y-1 hover:border-neutral-850 hover:shadow-black/70">
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-neutral-950" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {image ? (
          <img src={image} alt={product.title} className="h-44 w-full object-cover transition duration-300 hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-xs font-semibold text-neutral-600">
            No Image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1 space-y-2">
          <h3 className="line-clamp-2 text-sm font-bold text-white transition hover:text-[#d4b26f]">{product.title}</h3>
          <div className="flex items-center justify-between gap-3 text-xs text-neutral-450">
            <span className="font-semibold text-[#d4b26f]">${Number(product.price || 0).toFixed(2)}</span>
            <span>Rating {Number(product.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <Link
          to={`/products/${product._id}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-neutral-800"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default RecommendationCard;
