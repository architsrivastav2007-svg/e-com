import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Checkout</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Shipping details</h1>
        <p className="max-w-2xl text-slate-600">Confirm your delivery information and place your Cash On Delivery order.</p>
      </div>

      {(error || cartError) ? <ErrorMessage message={error || cartError} /> : null}
      {cartItems.length === 0 && !cartLoading ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Your cart is empty</h2>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Continue Shopping
          </Link>
        </div>
      ) : null}

      {cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.7fr)] lg:items-start">
          <form onSubmit={handlePlaceOrder} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name" />
              <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone number" />
              <InputField label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" className="sm:col-span-2" />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
              <InputField label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal code" />
              <InputField label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Payment Method</p>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                Cash On Delivery
              </div>
            </div>

            <Button type="submit" loading={loading} className="mt-6 w-full">
              Place Order
            </Button>
          </form>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Order Summary</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{totalItems} items</span>
              </div>
              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${Number(totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-slate-900">${totals.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-slate-900">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
                  <span className="font-semibold text-slate-900">Final Total</span>
                  <span className="font-black text-slate-950">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  );
};

export default Checkout;
