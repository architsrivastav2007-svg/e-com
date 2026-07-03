import { Link, useParams } from 'react-router-dom';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-emerald-950/40 bg-emerald-950/10 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">Order Success</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white font-luxury-sans">Your order has been placed</h1>
        <p className="mt-3 text-xs text-neutral-400">Order ID: {id}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/my-orders" className="inline-flex items-center justify-center rounded-full bg-[#d4b26f] px-5 py-3 text-xs font-bold text-black transition hover:bg-[#c3a164]">
            View My Orders
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-800">
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
