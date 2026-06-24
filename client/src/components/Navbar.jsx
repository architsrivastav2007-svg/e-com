import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingBag } from 'react-icons/fa';

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen((current) => !current);
  const handleClose = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3 text-slate-900" onClick={handleClose}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <FaShoppingBag />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">ShopSphere</span>
            <span className="block text-xs uppercase tracking-[0.32em] text-slate-500">E-Commerce</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            Cart
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </nav>

        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-3 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
            <NavLink to="/" className={linkClass} onClick={handleClose}>
              Home
            </NavLink>
            <NavLink to="/products" className={linkClass} onClick={handleClose}>
              Products
            </NavLink>
            <NavLink to="/cart" className={linkClass} onClick={handleClose}>
              Cart
            </NavLink>
            <NavLink to="/login" className={linkClass} onClick={handleClose}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass} onClick={handleClose}>
              Register
            </NavLink>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
