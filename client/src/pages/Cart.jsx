import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Button from '../components/Button.jsx';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await updateQuantity(productId, Number(quantity));
    } catch (requestError) {
      // CartContext already exposes the message in the shared error state.
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (requestError) {
      // CartContext already exposes the message in the shared error state.
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (requestError) {
      // CartContext already exposes the message in the shared error state.
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Shopping Cart</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Your Cart</h1>
        <p className="max-w-2xl text-slate-600">Review items, adjust quantities, and continue shopping when you’re ready.</p>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && cartItems.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Your cart is empty</h2>
          <p className="mt-2 text-slate-600">Add products to see them here.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : null}

      {!loading && !error && cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)] lg:items-start">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = item.product || {};
              const image = product.images?.[0];
              const maxQuantity = Number(product.stock || 1);

              return (
                <article key={product._id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
                    <div className="overflow-hidden rounded-2xl bg-slate-100">
                      {image ? (
                        <img src={image} alt={product.title} className="h-24 w-full object-cover" />
                      ) : (
                        <div className="flex h-24 items-center justify-center text-xs font-semibold text-slate-500">
                          No Image
                        </div>
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

                      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-slate-700">Quantity</span>
                          <select
                            value={item.quantity}
                            onChange={(event) => handleQuantityChange(product._id, event.target.value)}
                            disabled={loading}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                          >
                            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div>
                          <p className="mb-2 block text-sm font-semibold text-slate-700">Subtotal</p>
                          <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                            ${Number(item.subtotal || 0).toFixed(2)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(product._id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
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
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{totalItems} items</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-600">Total Price</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">${Number(totalPrice || 0).toFixed(2)}</p>
              </div>
              <div className="space-y-3">
                <Button type="button" onClick={handleClearCart} loading={loading} className="w-full">
                  Clear Cart
                </Button>
                <Link
                  to="/products"
                  className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/checkout"
                  className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
};

export default Cart;
