import RecommendationCard from './RecommendationCard.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const RecommendationSection = ({ title, products = [], loading = false, error = '' }) => {
  if (loading) {
    return (
      <section className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl border border-neutral-900 bg-[#0e0e0e] p-4 shadow-2xl">
              <div className="h-44 rounded-2xl bg-neutral-800" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-3/4 rounded-full bg-neutral-800" />
                <div className="h-4 w-1/2 rounded-full bg-neutral-800" />
                <div className="h-10 rounded-full bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        <div className="rounded-3xl border border-dashed border-neutral-850 bg-neutral-950 px-6 py-10 text-center text-neutral-450 shadow-2xl">
          No recommendations available
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <RecommendationCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;
