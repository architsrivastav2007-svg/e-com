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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      
      {/* Heading Section */}
      <div className="space-y-3 px-2">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d4b26f]">Orders</p>
        <h1 className="font-luxury-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl">My Orders</h1>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 ? (
        <div className="rounded-[2.5rem] border border-neutral-900 bg-[#0b0b0b] px-6 py-20 text-center shadow-2xl space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight text-white">No Orders Found</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">You have not placed any orders yet.</p>
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

      {/* Order List */}
      {!loading && !error && orders.length > 0 ? (
        <div className="grid gap-4 px-2">
          {orders.map((order) => (
            <article key={order._id} className="rounded-[2rem] border border-neutral-900 bg-[#0b0b0b] p-6 shadow-md transition hover:border-neutral-800">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Order #{order._id.slice(-6).toUpperCase()}</h2>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                  <p className="text-xs text-neutral-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-neutral-400 font-semibold">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                </div>
                
                <div className="flex flex-col gap-3 items-start md:items-end">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold">Total Price</p>
                    <p className="text-xl font-black text-[#d4b26f] mt-0.5">${Number(order.totalPrice || 0).toFixed(2)}</p>
                  </div>
                  <Link 
                    to={`/orders/${order._id}`} 
                    className="inline-flex rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-white transition hover:bg-neutral-800 px-5 py-2.5"
                  >
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
