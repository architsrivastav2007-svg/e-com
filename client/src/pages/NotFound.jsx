import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-neutral-900 bg-[#0b0b0b] p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white font-luxury-sans">Page not found</h1>
        <p className="mt-2 text-xs text-neutral-400">The page you requested does not exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-[#d4b26f] px-5 py-3 text-xs font-bold text-black transition hover:bg-[#c3a164]"
        >
          Go home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
