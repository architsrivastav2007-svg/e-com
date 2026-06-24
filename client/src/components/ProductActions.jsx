import { FaCartShopping } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const ProductActions = ({ stock, quantity, setQuantity, onBack }) => {
  const inStock = Number(stock) > 0;
  const quantityOptions = Array.from({ length: Number(stock) || 0 }, (_, index) => index + 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Quantity</p>
          <label htmlFor="quantity" className="mt-2 block text-sm text-slate-600">
            Select quantity
          </label>
        </div>
        <select
          id="quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          disabled={!inStock}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {quantityOptions.length > 0 ? (
            quantityOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))
          ) : (
            <option value={1}>1</option>
          )}
        </select>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!inStock}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FaCartShopping />
          Add to Cart
        </button>
        <Link
          to="/products"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductActions;
