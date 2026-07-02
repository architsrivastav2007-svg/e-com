import { useEffect, useState } from 'react';
import { FaBoxOpen, FaMoneyBillWave, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { getAdminDashboard } from '../../services/adminService.js';
import ToastMessage from '../../components/ToastMessage.jsx';
import OrderStatusBadge from '../../components/OrderStatusBadge.jsx';
import { ListSkeleton, StatSkeleton } from '../../components/admin/AdminSkeletons.jsx';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const metricCards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: FaMoneyBillWave },
  { key: 'totalOrders', label: 'Total Orders', icon: FaShoppingCart },
  { key: 'totalUsers', label: 'Total Users', icon: FaUsers },
  { key: 'totalProducts', label: 'Total Products', icon: FaBoxOpen },
];

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminDashboard();
        setDashboard(data?.dashboard || null);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || requestError?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

  return (
    <div className="space-y-8">
      <ToastMessage message={error} type="error" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Store overview</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Track revenue, stock health, and recent activity from a single command center.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <StatSkeleton key={card.key} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(({ key, label, icon: Icon }) => (
            <article key={key} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                    {key === 'totalRevenue' ? formatCurrency(dashboard?.[key]) : dashboard?.[key] ?? 0}
                  </p>
                </div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Recent Orders</h2>
              <p className="text-sm text-slate-600">Latest five orders across the store.</p>
            </div>
          </div>

          {loading ? (
            <ListSkeleton rows={5} />
          ) : (
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {dashboard?.recentOrders?.length ? (
                    dashboard.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-4 py-4 font-semibold text-slate-900">{order.customerName}</td>
                        <td className="px-4 py-4 text-slate-600">{formatCurrency(order.totalPrice)}</td>
                        <td className="px-4 py-4"><OrderStatusBadge status={order.orderStatus} /></td>
                        <td className="px-4 py-4 text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-10 text-center text-slate-500">
                        No recent orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Low Stock Products</h2>
            <div className="mt-4 space-y-3">
              {loading ? (
                <ListSkeleton rows={4} />
              ) : dashboard?.lowStockProducts?.length ? (
                dashboard.lowStockProducts.map((product) => (
                  <div key={product._id} className="rounded-2xl border border-slate-200 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{product.title}</p>
                        <p className="text-sm text-slate-500">{product.category}</p>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Stock {product.stock}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No low stock products.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">Best Sellers</h2>
            <div className="mt-4 space-y-3">
              {loading ? (
                <ListSkeleton rows={4} />
              ) : dashboard?.bestSellingProducts?.length ? (
                dashboard.bestSellingProducts.map((product) => (
                  <div key={product._id} className="rounded-2xl border border-slate-200 px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{product.title}</p>
                        <p className="text-sm text-slate-500">{product.quantitySold} sold</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{formatCurrency(product.totalRevenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No sales data yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;