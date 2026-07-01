import { FaCartShopping, FaHeart, FaRegHeart } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useState } from 'react';

const ProductActions = ({ productId, stock, quantity, setQuantity, onBack, backToProductsPath = '/products' }) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState('');
  const inStock = Number(stock) > 0;
  const quantityOptions = Array.from({ length: Number(stock) || 0 }, (_, index) => index + 1);
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = async () => {
    try {
      setActionError('');
      await addToCart(productId, quantity);
    } catch (error) {
      setActionError(error?.response?.data?.message || error?.message || 'Failed to add item to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setActionError('');

      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      setActionError(error?.response?.data?.message || error?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Quantity</p>
          <label htmlFor="quantity" className="mt-2 block text-sm text-slate-600">
            Select quantity
          </label>
        </div>
        <select
          id="quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          disabled={!inStock}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {quantityOptions.length > 0 ? (
            quantityOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))
          ) : (
            <option value={1}>1</option>
          )}
        </select>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FaCartShopping />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
        <Link
          to={backToProductsPath}
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
        >
          Back to Products
        </Link>
      </div>
      <button
        type="button"
        onClick={handleWishlistToggle}
        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition ${
          inWishlist
            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900'
        }`}
      >
        {inWishlist ? <FaHeart /> : <FaRegHeart />}
        {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
      {actionError ? <p className="mt-4 text-sm font-medium text-red-600">{actionError}</p> : null}
    </div>
  );
};

export default ProductActions;
