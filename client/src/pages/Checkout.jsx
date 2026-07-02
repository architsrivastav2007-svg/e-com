import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { placeOrder } from '../services/orderService.js';

const calculateTotals = (subtotal) => {
  const shippingCost = subtotal > 0 ? 150 : 0;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + shippingCost + tax).toFixed(2));

  return { shippingCost, tax, total };
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totalItems, totalPrice, loading: cartLoading, error: cartError, clearCart, fetchCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totals = useMemo(() => calculateTotals(Number(totalPrice || 0)), [totalPrice]);

  useEffect(() => {
    if (user?.name) {
      setFormData((current) => ({ ...current, fullName: user.name }));
    }
  }, [user?.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const requiredFields = ['fullName', 'phoneNumber', 'address', 'city', 'state', 'postalCode', 'country'];
    const missingField = requiredFields.find((field) => !formData[field].trim());

    if (missingField) {
      setError('Please complete all shipping fields');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setError('');

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const data = await placeOrder({
        shippingAddress: formData,
        paymentMethod: 'Cash On Delivery',
      });

      await clearCart();
      await fetchCart();
      navigate(`/order-success/${data.order._id}`, { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      
      {/* Heading Section */}
      <div className="space-y-3 px-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Checkout</p>
        <h1 className="font-luxury-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Shipping Details</h1>
        <p className="max-w-2xl text-xs md:text-sm text-neutral-400 font-medium">
          Confirm your delivery information and place your Cash On Delivery order.
        </p>
      </div>

      {(error || cartError) ? <ErrorMessage message={error || cartError} /> : null}

      {/* Empty State */}
      {cartItems.length === 0 && !cartLoading ? (
        <div className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] px-6 py-20 text-center shadow-2xl space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight text-white">Your cart is empty.</h2>
          <div className="pt-2">
            <Link 
              to="/products" 
              className="inline-flex rounded-full bg-[#d4b26f] text-black hover:bg-[#c3a164] px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : null}

      {/* Checkout Grid Content */}
      {cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.7fr)] lg:items-start px-2">
          
          {/* Shipping Form */}
          <form onSubmit={handlePlaceOrder} className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] p-6 shadow-2xl sm:p-8 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" />
              <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone number" />
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" className="sm:col-span-2" />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
              <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal code" />
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            </div>

            {/* Payment Method Option */}
            <div className="rounded-2xl border border-neutral-900/60 bg-neutral-950 p-5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Payment Method</p>
              <div className="rounded-xl border border-neutral-900 bg-[#0b0b0b] px-4 py-3 text-xs font-bold text-white">
                Cash On Delivery
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-center inline-flex items-center justify-center rounded-full bg-[#d4b26f] text-xs font-bold text-black uppercase tracking-wider transition hover:bg-[#c3a164] py-3.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Checkout Totals Aside panel */}
          <aside className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Order Summary</span>
              <span className="rounded-full bg-neutral-950 border border-neutral-900 px-3 py-1 text-xs font-semibold text-white">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-3.5 rounded-2xl bg-neutral-950 border border-neutral-900/40 p-4.5 text-xs text-neutral-400 font-medium">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">${Number(totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping Cost</span>
                <span className="font-bold text-white">${totals.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (10%)</span>
                <span className="font-bold text-white">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-900 pt-3.5 text-sm font-semibold">
                <span className="text-neutral-300">Final Total</span>
                <span className="text-xl font-black text-[#d4b26f]">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </aside>

        </div>
      ) : null}
    </section>
  );
};

export default Checkout;
