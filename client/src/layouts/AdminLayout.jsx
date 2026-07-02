import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaBoxOpen, FaChartLine, FaSignOutAlt, FaTimes, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const adminLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
    isActive ? 'bg-white/12 text-white shadow-lg shadow-black/10' : 'text-slate-300 hover:bg-white/8 hover:text-white'
  }`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => setSidebarOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const navigation = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
    { to: '/admin/products', label: 'Products', icon: FaBoxOpen },
    { to: '/admin/orders', label: 'Orders', icon: FaShoppingCart },
    { to: '/admin/users', label: 'Users', icon: FaUsers },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/10 bg-slate-950/95 px-5 py-6 text-white backdrop-blur transition duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between lg:justify-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-slate-400">Admin Panel</p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white">ShopSphere</h1>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 lg:hidden"
            aria-label="Close admin sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={adminLinkClass} onClick={handleClose}>
              <Icon className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Signed in as</p>
          <p className="mt-2 text-lg font-bold text-white">{user?.name || 'Admin'}</p>
          <p className="text-sm text-slate-300">{user?.email || 'admin@example.com'}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close admin navigation overlay"
          onClick={handleClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      ) : null}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 p-3 text-slate-700 transition hover:bg-slate-100 lg:hidden"
                aria-label="Open admin sidebar"
              >
                <FaBars />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Administration</p>
                <h2 className="text-xl font-black tracking-tight text-slate-950">Control Center</h2>
              </div>
            </div>
            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 sm:block">
              {user?.role === 'admin' ? 'Administrator' : 'Restricted Access'}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;