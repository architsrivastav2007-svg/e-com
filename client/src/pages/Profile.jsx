import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Profile</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Welcome, {user?.name || 'User'}</h1>
        <p className="mt-2 text-slate-600">This page is protected and shows the currently authenticated user.</p>
      </div>
    </section>
  );
};

export default Profile;
