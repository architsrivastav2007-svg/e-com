import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [actionError, setActionError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const firstImage = product?.images?.[0];
  const inStock = Number(product?.stock) > 0;
  const inWishlist = isInWishlist(product._id);

  // Dynamic Badge Assignment
  const getBadge = () => {
    if (product.featured) {
      return { text: 'Trending', style: 'bg-amber-950/60 text-[#d4b26f] border border-[#d4b26f]/30' };
    }
    if (inStock && product.stock <= 3) {
      return { text: 'Low Stock', style: 'bg-rose-950/60 text-rose-400 border border-rose-800/30' };
    }
    const isRecentlyCreated = product.createdAt 
      ? new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : false;
    if (isRecentlyCreated) {
      return { text: 'New', style: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/30' };
    }
    return null;
  };

  const badge = getBadge();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setActionError('');
      await addToCart(product._id, 1);
    } catch (error) {
      setActionError(error?.response?.data?.message || error?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setActionError('');
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error) {
      setActionError(error?.response?.data?.message || error?.message || 'Failed to update wishlist');
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-900 bg-[#0b0b0b] transition-all duration-300 hover:-translate-y-1.5 hover:border-neutral-800 hover:shadow-2xl hover:shadow-black/70">
      
      {/* Product Image Gallery Wrapper */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-950 rounded-2xl">
        <Link to={`/products/${product._id}`} state={{ search: location.search }} className="block h-full w-full">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 text-xs font-semibold text-neutral-600">
              No Image Available
            </div>
          )}
        </Link>

        {/* Dynamic Badge */}
        {badge && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.style}`}>
            {badge.text}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/60 backdrop-blur-md text-sm border border-neutral-800 transition hover:scale-105 hover:bg-neutral-900 ${
            inWishlist ? 'text-[#d4b26f]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {inWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      {/* Info & CTA Section */}
      <div className="flex flex-1 flex-col p-4.5">
        <div className="flex-1 space-y-2">
          
          {/* Category */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4b26f]/70">
            {product.category}
          </span>

          {/* Title & Desc */}
          <div className="space-y-1">
            <h3 className="line-clamp-1 text-sm font-bold text-white transition hover:text-[#d4b26f]">
              <Link to={`/products/${product._id}`} state={{ search: location.search }}>
                {product.title}
              </Link>
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-neutral-400">
              {product.description}
            </p>
          </div>

          {/* Rating / Stock Info */}
          <div className="flex items-center gap-4 pt-1 text-xs text-neutral-400">
            <div className="flex items-center gap-1 font-semibold text-white">
              <FaStar className="text-[#d4b26f]" />
              <span>{Number(product.rating ?? 0).toFixed(1)}</span>
            </div>
            <span>
              {inStock ? `${product.stock} in stock` : 'Sold out'}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-lg font-black tracking-tight text-white">${Number(product.price).toFixed(2)}</p>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
              inStock ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950/20 text-rose-400 border border-rose-900/30'
            }`}>
              {inStock ? 'Available' : 'Out of Stock'}
            </span>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product._id}`}
              state={{ search: location.search }}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-white transition hover:bg-neutral-800 py-2.5"
            >
              Details
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#d4b26f] text-xs font-bold text-black transition hover:bg-[#c3a164] disabled:opacity-50 disabled:cursor-not-allowed py-2.5"
            >
              <FaShoppingCart />
              Add
            </button>
          </div>
          {actionError && <p className="text-[11px] font-medium text-rose-500 text-center">{actionError}</p>}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
