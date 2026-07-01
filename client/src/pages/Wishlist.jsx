import { Link } from 'react-router-dom';
import { FaStar, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Button from '../components/Button.jsx';
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Wishlist</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Your Wishlist</h1>
        <p className="max-w-2xl text-slate-600">Save products you want to come back to and move them to cart whenever you are ready.</p>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && wishlistItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Your wishlist is empty.</h2>
          <p className="mt-2 text-slate-600">Browse products to start saving items you love.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Browse Products
          </Link>
        </div>
      ) : null}

      {!loading && !error && wishlistItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.7fr)] lg:items-start">
          <div className="space-y-4">
            {wishlistItems.map((product) => {
              const image = product.images?.[0];
              const inStock = Number(product.stock || 0) > 0;

              return (
                <article key={product._id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
                    <div className="overflow-hidden rounded-2xl bg-slate-100">
                      {image ? (
                        <img src={image} alt={product.title} className="h-24 w-full object-cover" />
                      ) : (
                        <div className="flex h-24 items-center justify-center text-xs font-semibold text-slate-500">No Image</div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h2 className="text-xl font-bold tracking-tight text-slate-950">{product.title}</h2>
                          <p className="text-sm text-slate-600">{product.category}</p>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
                          <p className="text-lg font-black text-slate-950">${Number(product.price || 0).toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                          <FaStar className="text-amber-500" />
                          <span>{Number(product.rating ?? 0).toFixed(1)}</span>
                        </div>
                        <span>{inStock ? `${product.stock} in stock` : 'Out of stock'}</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <Link
                          to={`/products/${product._id}`}
                          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                          View Product
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={!inStock}
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(product._id)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <FaTrash />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Summary</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{wishlistItems.length} items</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Saved items</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{wishlistItems.length}</p>
              </div>
              <div className="space-y-3">
                <Button type="button" onClick={handleClear} loading={loading} className="w-full">
                  Clear Wishlist
                </Button>
                <Link
                  to="/products"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
};

export default Wishlist;
