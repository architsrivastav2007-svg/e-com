import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import OrderStatusBadge from '../components/OrderStatusBadge.jsx';
import { getMyOrders } from '../services/orderService.js';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getMyOrders();
        setOrders(data?.orders || []);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Orders</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">My Orders</h1>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && orders.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">No Orders Found</h2>
          <p className="mt-2 text-slate-600">You have not placed any orders yet.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Continue Shopping
          </Link>
        </div>
      ) : null}

      {!loading && !error && orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article key={order._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold tracking-tight text-slate-950">Order #{order._id.slice(-6)}</h2>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                  <p className="text-sm text-slate-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-600">{order.items.length} items</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total</p>
                  <p className="text-2xl font-black text-slate-950">${Number(order.totalPrice || 0).toFixed(2)}</p>
                  <Link to={`/orders/${order._id}`} className="mt-3 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default MyOrders;
