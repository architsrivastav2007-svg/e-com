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
    <div className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Quantity</p>
          <label htmlFor="quantity" className="mt-1 block text-xs text-neutral-400">
            Select quantity
          </label>
        </div>
        <select
          id="quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          disabled={!inStock}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white outline-none transition focus:border-[#d4b26f]/60 disabled:cursor-not-allowed disabled:bg-neutral-900/40"
        >
          {quantityOptions.length > 0 ? (
            quantityOptions.map((value) => (
              <option key={value} value={value} className="bg-neutral-950 text-white">
                {value}
              </option>
            ))
          ) : (
            <option value={1} className="bg-neutral-950 text-white">1</option>
          )}
        </select>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock || loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d4b26f] px-5 py-3 text-xs font-bold text-black transition hover:bg-[#c3a164] disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          <FaCartShopping />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
        <Link
          to={backToProductsPath}
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
        >
          Back to Products
        </Link>
      </div>
      <button
        type="button"
        onClick={handleWishlistToggle}
        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs font-bold transition ${
          inWishlist
            ? 'border-rose-950/40 bg-rose-950/20 text-rose-450 hover:bg-rose-950/30'
            : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800'
        }`}
      >
        {inWishlist ? <FaHeart /> : <FaRegHeart />}
        {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
      {actionError ? <p className="mt-4 text-xs font-semibold text-rose-400 text-center">{actionError}</p> : null}
    </div>
  );
};

export default ProductActions;
