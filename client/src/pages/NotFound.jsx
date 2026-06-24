import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Go home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
