import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductImageGallery from '../components/ProductImageGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductPrice from '../components/ProductPrice.jsx';
import ProductActions from '../components/ProductActions.jsx';
import RelatedInfo from '../components/RelatedInfo.jsx';
import { getProductById } from '../services/productService.js';
import { getRecommendations } from '../services/recommendationService.js';
import RecommendationSection from '../components/RecommendationSection.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState({
    similarCategory: [],
    similarPrice: [],
    popular: [],
    recent: [],
  });
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRecommendations({
      similarCategory: [],
      similarPrice: [],
      popular: [],
      recent: [],
    });
    setRecommendationsError('');
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError('');
        setProduct(null);

        const data = await getProductById(id);
        const loadedProduct = data?.product;

        if (!loadedProduct) {
          setError('Product not found');
          return;
        }

        setProduct(loadedProduct);
        setQuantity(1);
      } catch (requestError) {
        const status = requestError?.response?.status;
        const message =
          requestError?.response?.data?.message || requestError?.message || 'Failed to fetch product';

        if (status === 404 || message.toLowerCase().includes('not found')) {
          setError('Product not found');
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!product?._id) {
        return;
      }

      try {
        setRecommendationsLoading(true);
        setRecommendationsError('');

        const data = await getRecommendations(product._id);
        setRecommendations(
          data?.recommendations || {
            similarCategory: [],
            similarPrice: [],
            popular: [],
            recent: [],
          },
        );
      } catch (requestError) {
        setRecommendationsError(
          requestError?.response?.data?.message || requestError?.message || 'Failed to load recommendations',
        );
      } finally {
        setRecommendationsLoading(false);
      }
    };

    loadRecommendations();
  }, [product?._id]);

  const hasRecommendations =
    recommendations.similarCategory.length > 0 ||
    recommendations.similarPrice.length > 0 ||
    recommendations.popular.length > 0 ||
    recommendations.recent.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {loading ? <LoadingSpinner /> : null}

      {!loading && error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && product ? (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <ProductImageGallery title={product.title} images={product.images || []} />

          <div className="space-y-6">
            <ProductInfo product={product} />
            <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Recommended For You</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">Discover products tailored to this item</h2>
              </div>

              <div className="space-y-8">
                <RecommendationSection
                  title="Similar Products"
                  products={recommendations.similarCategory}
                  loading={recommendationsLoading}
                  error={recommendationsError}
                />
                <RecommendationSection
                  title="Popular Products"
                  products={recommendations.popular}
                  loading={recommendationsLoading}
                  error={recommendationsError}
                />
                <RecommendationSection
                  title="New Arrivals"
                  products={recommendations.recent}
                  loading={recommendationsLoading}
                  error={recommendationsError}
                />
                {!recommendationsLoading && !recommendationsError && !hasRecommendations ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                    No recommendations available right now.
                  </div>
                ) : null}
              </div>
            </div>
            <ProductPrice price={product.price} rating={product.rating} stock={product.stock} />
            <ProductActions
              productId={product._id}
              stock={product.stock}
              quantity={quantity}
              setQuantity={setQuantity}
              backToProductsPath={`/products${location.state?.search || ''}`}
            />
            <RelatedInfo product={product} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductDetails;
