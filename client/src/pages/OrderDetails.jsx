import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import Button from '../components/Button.jsx';
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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Order Details</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Order #{order._id.slice(-6)}</h1>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-start">
        <div className="space-y-4">
          {order.items.map((item) => {
            const product = item.product || {};
            const image = product.images?.[0];

            return (
              <article key={`${order._id}-${product._id}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center">
                  <div className="overflow-hidden rounded-2xl bg-slate-100">
                    {image ? (
                      <img src={image} alt={product.title} className="h-24 w-full object-cover" />
                    ) : (
                      <div className="flex h-24 items-center justify-center text-xs font-semibold text-slate-500">No Image</div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-950">{product.title}</h2>
                        <p className="text-sm text-slate-600">{product.category}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Subtotal</p>
                        <p className="text-lg font-black text-slate-950">${Number(item.subtotal || 0).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span>Quantity: <span className="font-semibold text-slate-900">{item.quantity}</span></span>
                      <span>Price: <span className="font-semibold text-slate-900">${Number(item.price || 0).toFixed(2)}</span></span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <div className="space-y-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Subtotal</span><span className="font-semibold text-slate-900">${Number(order.subtotal).toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Tax</span><span className="font-semibold text-slate-900">${Number(order.tax).toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Shipping</span><span className="font-semibold text-slate-900">${Number(order.shippingCost).toFixed(2)}</span></div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base"><span className="font-semibold text-slate-900">Total</span><span className="font-black text-slate-950">${Number(order.totalPrice).toFixed(2)}</span></div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-950">Shipping Address</h2>
            <p className="text-sm text-slate-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-slate-600">{order.shippingAddress.phoneNumber}</p>
            <p className="text-sm text-slate-600">{order.shippingAddress.address}</p>
            <p className="text-sm text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="text-sm text-slate-600">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Payment Method</p>
            <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">{order.paymentMethod}</div>
            <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">Payment Status: {order.paymentStatus}</div>
          </div>

          {actionError ? <ErrorMessage message={actionError} /> : null}
          {canCancel ? (
            <Button type="button" loading={actionLoading} onClick={handleCancel} className="w-full">
              Cancel Order
            </Button>
          ) : null}
          <Link to="/my-orders" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
            Back to My Orders
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default OrderDetails;
