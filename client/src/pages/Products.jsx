import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { getProducts } from '../services/productService.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getProducts();
        setProducts(data?.products ?? []);
      } catch (requestError) {
        const message =
          requestError?.response?.data?.message || requestError?.message || 'Failed to fetch products';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Catalog</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Products</h1>
        <p className="max-w-2xl text-slate-600">
          Browse the current product catalog from the API. The grid is responsive and each card is ready for future cart and product detail interactions.
        </p>
      </div>

      {loading ? <LoadingSpinner /> : null}
      {!loading && error ? <ErrorMessage message={error} /> : null}
      {!loading && !error && products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
          No Products Found
        </div>
      ) : null}
      {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
    </section>
  );
};

export default Products;
