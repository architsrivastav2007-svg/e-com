import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import { cancelOrder, getOrderById } from '../services/orderService.js';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getOrderById(id);
        setOrder(data?.order || null);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handleCancel = async () => {
    try {
      setActionLoading(true);
      setActionError('');
      const data = await cancelOrder(id);
      setOrder(data?.order || order);
    } catch (requestError) {
      setActionError(requestError?.response?.data?.message || requestError?.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!order) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorMessage message="Order not found" />
      </section>
    );
  }

  const canCancel = ['Pending', 'Processing'].includes(order.orderStatus);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      
      {/* Heading Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Order Details</p>
          <h1 className="font-luxury-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Order #{order._id.slice(-6).toUpperCase()}</h1>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      {/* Grid Content */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-start px-2">
        
        {/* Items List */}
        <div className="space-y-4">
          {order.items.map((item) => {
            const product = item.product || {};
            const image = product.images?.[0];

            return (
              <article key={`${order._id}-${product._id}`} className="rounded-3xl border border-neutral-900 bg-[#0b0b0b] p-4.5 transition-all hover:border-neutral-800 shadow-md">
                <div className="grid gap-5 sm:grid-cols-[100px_minmax(0,1fr)] sm:items-center">
                  
                  {/* Item Image */}
                  <div className="overflow-hidden rounded-2xl bg-neutral-950 aspect-square">
                    {image ? (
                      <img src={image} alt={product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-neutral-600">No Image</div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-base font-bold text-white transition hover:text-[#d4b26f]">
                          <Link to={`/products/${product._id}`}>{product.title}</Link>
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#d4b26f]/70 mt-1">{product.category}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-semibold">Subtotal</p>
                        <p className="text-lg font-black text-white mt-0.5">${Number(item.subtotal || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 font-medium">
                      <span>Quantity: <span className="font-bold text-white">{item.quantity}</span></span>
                      <span>Price: <span className="font-bold text-white">${Number(item.price || 0).toFixed(2)}</span></span>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* Pricing / Details Aside Panel */}
        <aside className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] p-6 shadow-2xl space-y-6">
          
          {/* pricing totals */}
          <div className="space-y-3.5 rounded-2xl bg-neutral-950 border border-neutral-900/40 p-4.5 text-xs text-neutral-400 font-medium">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax (10%)</span>
              <span className="font-bold text-white">${Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-bold text-white">${Number(order.shippingCost).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-900 pt-3.5 text-sm font-semibold">
              <span className="text-neutral-300">Total</span>
              <span className="text-xl font-black text-[#d4b26f]">${Number(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3 rounded-2xl bg-neutral-950 border border-neutral-900/60 p-4.5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Shipping Address</h2>
            <div className="text-xs text-neutral-300 space-y-1.5">
              <p className="font-semibold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phoneNumber}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment info */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Payment Details</p>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white">
              Method: {order.paymentMethod}
            </div>
            <div className="rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-white">
              Status: {order.paymentStatus}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {actionError ? <ErrorMessage message={actionError} /> : null}
            {canCancel ? (
              <button
                type="button"
                onClick={handleCancel}
                disabled={actionLoading}
                className="w-full text-center inline-flex items-center justify-center rounded-full bg-rose-950/20 border border-rose-900/30 text-xs font-bold text-rose-400 hover:bg-rose-900/10 transition-colors py-3.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Cancelling...' : 'Cancel Order'}
              </button>
            ) : null}
            <Link
              to="/my-orders"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#d4b26f] text-xs font-bold text-black transition hover:bg-[#c3a164] py-3.5 text-center"
            >
              Back to My Orders
            </Link>
          </div>

        </aside>
      </div>
    </section>
  );
};

export default OrderDetails;
