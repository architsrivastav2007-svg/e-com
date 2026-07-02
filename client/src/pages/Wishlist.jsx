import { Link } from 'react-router-dom';
import { FaStar, FaTrash, FaShoppingCart } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Wishlist = () => {
  const { wishlistItems, loading, error, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (requestError) {
      // Shared wishlist state already exposes the message.
    }
  };

  const handleClear = async () => {
    try {
      await clearWishlist();
    } catch (requestError) {
      // Shared wishlist state already exposes the message.
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
    } catch (requestError) {
      // CartContext already exposes the message in the shared error state.
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      
      {/* Heading Section */}
      <div className="space-y-3 px-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Wishlist</p>
        <h1 className="font-luxury-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Your Wishlist</h1>
        <p className="max-w-2xl text-xs md:text-sm text-neutral-400 font-medium">
          Save products you want to come back to and move them to cart whenever you are ready.
        </p>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}

      {/* Empty State */}
      {!loading && !error && wishlistItems.length === 0 ? (
        <div className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] px-6 py-20 text-center shadow-2xl space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight text-white">Your wishlist is empty.</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">Browse products to start saving items you love.</p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex rounded-full bg-[#d4b26f] text-black hover:bg-[#c3a164] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : null}

      {/* Wishlist Catalog Content */}
      {!loading && !error && wishlistItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.7fr)] lg:items-start px-2">
          
          {/* Items list */}
          <div className="space-y-4">
            {wishlistItems.map((product) => {
              const image = product.images?.[0];
              const inStock = Number(product.stock || 0) > 0;

              return (
                <article key={product._id} className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-4.5 transition-all hover:border-neutral-800 shadow-md">
                  <div className="grid gap-5 sm:grid-cols-[100px_minmax(0,1fr)] sm:items-center">
                    
                    {/* Item Image */}
                    <div className="overflow-hidden rounded-2xl bg-neutral-950 aspect-square">
                      {image ? (
                        <img src={image} alt={product.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-neutral-600">No Image</div>
                      )}
                    </div>

                    {/* Details and Actions */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-base font-bold text-white transition hover:text-[#d4b26f]">
                            <Link to={`/products/${product._id}`}>{product.title}</Link>
                          </h2>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4b26f]/70 mt-1">{product.category}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-semibold">Price</p>
                          <p className="text-lg font-black text-white mt-0.5">${Number(product.price || 0).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Ratings and availability */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                        <div className="flex items-center gap-1 font-semibold text-white">
                          <FaStar className="text-[#d4b26f]" />
                          <span>{Number(product.rating ?? 0).toFixed(1)}</span>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                          inStock ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950/20 text-rose-400 border border-rose-900/30'
                        }`}>
                          {inStock ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      {/* CTA grid */}
                      <div className="grid gap-2 grid-cols-3">
                        <Link
                          to={`/products/${product._id}`}
                          className="inline-flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-white transition hover:bg-neutral-800 py-2.5 text-center"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={!inStock}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#d4b26f] text-xs font-bold text-black transition hover:bg-[#c3a164] disabled:opacity-50 disabled:cursor-not-allowed py-2.5"
                        >
                          <FaShoppingCart className="text-xs" />
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(product._id)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-xs font-bold text-red-400 hover:bg-red-900/10 transition-colors py-2.5"
                        >
                          <FaTrash className="text-xs" />
                          Remove
                        </button>
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>

          {/* Aside Cart summary panel */}
          <aside className="rounded-[2rem] border border-neutral-900 bg-[#0b0b0b] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Summary</span>
              <span className="rounded-full bg-neutral-950 border border-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <div className="rounded-2xl bg-neutral-950 border border-neutral-900/40 p-4">
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Total Saved Items</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-white">{wishlistItems.length}</p>
            </div>
            
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="w-full text-center inline-flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white hover:border-neutral-700 transition py-3"
              >
                Clear Wishlist
              </button>
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#d4b26f] text-xs font-bold text-black transition hover:bg-[#c3a164] py-3 text-center"
              >
                Browse Products
              </Link>
            </div>
          </aside>

        </div>
      ) : null}
    </section>
  );
};

export default Wishlist;
