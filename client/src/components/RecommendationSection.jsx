import RecommendationCard from './RecommendationCard.jsx';
import ErrorMessage from './ErrorMessage.jsx';

const RecommendationSection = ({ title, products = [], loading = false, error = '' }) => {
  if (loading) {
    return (
      <section className="space-y-4">
        <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="h-44 rounded-2xl bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                <div className="h-4 w-1/2 rounded-full bg-slate-200" />
                <div className="h-10 rounded-full bg-slate-200" />
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
        <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="space-y-4">
        <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
          No recommendations available
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <RecommendationCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationSection;
