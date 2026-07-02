import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        setError('');
        
        const params = {
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          sort: sortOption === 'featured' ? undefined : sortOption,
          limit: 12, // display a curated set of 12 items on the home catalog
        };

        const data = await getProducts(params);
        setProducts(data?.products ?? []);
      } catch (requestError) {
        const message =
          requestError?.response?.data?.message || requestError?.message || 'Failed to fetch catalog';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, [selectedCategory, sortOption]);

  return (
    <div className="space-y-4 pb-20">
      
      {/* Hero Banner Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-950 aspect-[21/10] sm:aspect-[21/9] min-h-[360px] md:min-h-[480px]">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/luxury_fashion_hero.png"
              alt="ShopSphere Summer Collection"
              className="h-full w-full object-cover object-[center_35%] filter brightness-95"
            />
            {/* Smooth dark radial & linear overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/95 via-[#030303]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-8 sm:px-16 md:px-24">
            <div className="max-w-xl space-y-4 md:space-y-6">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-[#d4b26f]">
                Summer Collection – 2025
              </span>
              
              <h1 className="font-luxury-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
                Dress the <br />
                <span className="font-luxury-serif italic text-[#d4b26f] font-medium leading-none">part.</span>
              </h1>
              
              <p className="max-w-md text-xs md:text-sm leading-relaxed text-neutral-400 font-medium">
                Curated pieces from independent designers and heritage brands &mdash; edited for the discerning wardrobe.
              </p>
              
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d4b26f] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#c4a263] transition-all hover:scale-105 duration-300"
                >
                  Shop Now &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-4 py-6 border-b border-neutral-900/60 text-xs sm:text-sm font-medium px-4">
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="font-black text-lg text-[#d4b26f]">12,000+</span>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold">Products</span>
          </div>
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="font-black text-lg text-[#d4b26f]">200+</span>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold">Brands</span>
          </div>
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="font-black text-lg text-[#d4b26f]">Free</span>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold">Returns</span>
          </div>
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="font-black text-lg text-[#d4b26f]">1–3 Days</span>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold">Delivery</span>
          </div>
        </div>
      </section>

      {/* Catalog Display Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Category Selection Tabs & Sorting Options */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Clothing', 'Shoes', 'Bags', 'Accessories'].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#d4b26f] text-black shadow-lg shadow-[#d4b26f]/10'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sorters */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Visual slider control */}
            <button 
              type="button" 
              className="inline-flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            
            {/* Dropdown selector */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none rounded-xl bg-neutral-900 border border-neutral-800 pl-4 pr-10 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#d4b26f]/60 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="pointer-events-none absolute right-3.5 top-3.5 text-[8px] text-neutral-500">
                &#9660;
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic product list loader */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-neutral-900 bg-[#070707] px-6 py-20 text-center text-neutral-500 font-medium">
            No products found matching the criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
