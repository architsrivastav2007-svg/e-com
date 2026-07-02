import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useCart } from '../context/CartContext.jsx';

const Cart = () => {
  const { cartItems, totalItems, totalPrice, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      
      {/* Heading Section */}
      <div className="space-y-3 px-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Shopping Cart</p>
        <h1 className="font-luxury-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Your Cart</h1>
        <p className="max-w-2xl text-xs md:text-sm text-neutral-400 font-medium">
          Review items, adjust quantities, and continue shopping when you’re ready.
        </p>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}

      {/* Empty State */}
      {!loading && !error && cartItems.length === 0 ? (
        <div className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] px-6 py-20 text-center shadow-2xl space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight text-white">Your cart is empty.</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">Add products to see them here.</p>
          <div className="pt-2">
            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-[#d4b26f] text-black hover:bg-[#c3a164] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : null}

      {/* Cart Content Table/Layout */}
      {!loading && !error && cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)] lg:items-start px-2">
          
          {/* List of Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = item.product || {};
              const image = product.images?.[0];
              const maxQuantity = Number(product.stock || 1);

              return (
                <article key={product._id} className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-4.5 transition-all hover:border-neutral-800 shadow-md">
                  <div className="grid gap-5 sm:grid-cols-[100px_minmax(0,1fr)] sm:items-center">
                    
                    {/* Product Image */}
                    <div className="overflow-hidden rounded-2xl bg-neutral-950 aspect-square">
                      {image ? (
                        <img src={image} alt={product.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-neutral-600">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details, Quantity, Price, Subtotal */}
                    <div className="space-y-4">
                      
                      {/* Name / Category & Price */}
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

                      {/* Quantity Modifier & Subtotal & Remove Actions */}
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 sm:items-end">
                        
                        {/* Quantity Dropdown */}
                        <div className="space-y-1">
                          <label htmlFor={`quantity-${product._id}`} className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Quantity
                          </label>
                          <select
                            id={`quantity-${product._id}`}
                            value={item.quantity}
                            onChange={(event) => handleQuantityChange(product._id, event.target.value)}
                            disabled={loading}
                            className="w-full rounded-xl bg-neutral-950 border border-neutral-900 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4b26f]/60 cursor-pointer"
                          >
                            {Array.from({ length: maxQuantity }, (_, index) => index + 1).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Subtotal Display */}
                        <div className="space-y-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            Subtotal
                          </span>
                          <div className="rounded-xl bg-neutral-950 border border-neutral-900/60 px-3.5 py-2.5 text-xs font-bold text-white">
                            ${Number(item.subtotal || 0).toFixed(2)}
                          </div>
                        </div>

                        {/* Trash Action */}
                        <button
                          type="button"
                          onClick={() => handleRemove(product._id)}
                          disabled={loading}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-xs font-bold text-red-400 hover:bg-red-900/10 transition-colors py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <div className="rounded-2xl bg-neutral-950 border border-neutral-900/40 p-4">
              <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Total Price</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-white">${Number(totalPrice || 0).toFixed(2)}</p>
            </div>
            
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleClearCart}
                className="w-full text-center inline-flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white hover:border-neutral-700 transition py-3"
              >
                Clear Cart
              </button>
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white hover:border-neutral-700 transition py-3 text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/checkout"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#d4b26f] text-xs font-bold text-black transition hover:bg-[#c3a164] py-3 text-center"
              >
                Checkout
              </Link>
            </div>
          </aside>

        </div>
      ) : null}
    </section>
  );
};

export default Cart;
