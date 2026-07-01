import { Link, useParams } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-100/50 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Order Success</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Your order has been placed</h1>
        <p className="mt-3 text-slate-600">Order ID: {id}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/my-orders" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            View My Orders
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
