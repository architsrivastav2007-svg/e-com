import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductImageGallery from '../components/ProductImageGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductPrice from '../components/ProductPrice.jsx';
import ProductActions from '../components/ProductActions.jsx';
import RelatedInfo from '../components/RelatedInfo.jsx';
import { getProductById } from '../services/productService.js';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

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

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {loading ? <LoadingSpinner /> : null}

      {!loading && error ? <ErrorMessage message={error} /> : null}

      {!loading && !error && product ? (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <ProductImageGallery title={product.title} images={product.images || []} />

          <div className="space-y-6">
            <ProductInfo product={product} />
            <ProductPrice price={product.price} rating={product.rating} stock={product.stock} />
            <ProductActions stock={product.stock} quantity={quantity} setQuantity={setQuantity} />
            <RelatedInfo product={product} />
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ProductDetails;
