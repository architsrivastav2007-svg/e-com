const categoryOptions = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Shoes',
  'Books',
  'Grocery',
  'Beauty',
  'Sports',
  'Home',
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price Low to High', value: 'price_asc' },
  { label: 'Price High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating' },
];

const ProductsFilters = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  filters,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onStockChange,
  onSortChange,
}) => {
  return (
    <form
      onSubmit={onSearchSubmit}
      className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-6"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.7fr))] xl:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,0.6fr))]">
        <label className="block lg:col-span-1 xl:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Search Products</span>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search by product name"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Search
            </button>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
          <select
            value={filters.category}
            onChange={onCategoryChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category === 'All Categories' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Minimum Price</span>
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={onMinPriceChange}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Maximum Price</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={onMaxPriceChange}
            placeholder="Any"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={onStockChange}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          Only show products in stock
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Sort By</span>
          <select
            value={filters.sort}
            onChange={onSortChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </form>
  );
};

export default ProductsFilters;
