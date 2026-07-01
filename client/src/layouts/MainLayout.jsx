import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ToastMessage from '../components/ToastMessage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const MainLayout = () => {
  const { successMessage, error } = useCart();
  const { successMessage: wishlistSuccessMessage, error: wishlistError } = useWishlist();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <ToastMessage message={successMessage} type="success" />
      <ToastMessage message={error} type="error" />
      <ToastMessage message={wishlistSuccessMessage} type="success" />
      <ToastMessage message={wishlistError} type="error" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
