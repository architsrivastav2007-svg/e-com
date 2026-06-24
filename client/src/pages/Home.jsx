const Home = () => {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            Next-generation shopping experience
          </span>
          <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Build a modern storefront with fast browsing and clean checkout flows.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            This frontend is set up with React Router, Tailwind CSS, Axios, and a reusable layout so you can plug in the backend APIs feature by feature.
          </p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded-full bg-slate-200" />
            <div className="h-72 rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-800 to-slate-600" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 rounded-2xl bg-slate-100" />
              <div className="h-16 rounded-2xl bg-slate-100" />
              <div className="h-16 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
