import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { fetchProducts, fetchFilterOptions } from '../features/productSlice';
import api from '../services/api';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, page, pages, total, filterOptions } = useSelector(
    (state) => state.products
  );

  const [categoriesList, setCategoriesList] = useState([]);

  // Filters state (URL se initial values uthao)
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.keyword);

  // 1. Filter options aur Categories fetch karo
  useEffect(() => {
    dispatch(fetchFilterOptions());
    
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        const topCats = data.filter(cat => !cat.parentCategory);
        setCategoriesList(topCats);
      } catch (error) {
        console.error("Categories fetch error:", error);
      }
    };
    fetchCats();
  }, [dispatch]);

  // 2. URL change hone par filters update karo (Navbar click handle karne ke liye)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';
    const keywordFromUrl = searchParams.get('keyword') || '';
    const pageFromUrl = Number(searchParams.get('page')) || 1; // <-- URL se page number uthao
    
    // Agar URL badal gaya hai, to state update karo
    if (
      categoryFromUrl !== filters.category || 
      keywordFromUrl !== filters.keyword ||
      pageFromUrl !== filters.page
    ) {
      setFilters({
        ...filters,
        category: categoryFromUrl,
        keyword: keywordFromUrl,
        page: pageFromUrl // <-- Page number yahan set karo
      });
      setLocalSearch(keywordFromUrl);
    }
  }, [searchParams]); // <-- Sirf searchParams par depend karo

  // 3. Filters change hone par products fetch karo aur URL update karo
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params[key] = val;
    });
    dispatch(fetchProducts(params));
    setSearchParams(params);
  }, [filters, dispatch, setSearchParams]);

  // 4. Filter change function (Pagination ke liye smart hai)
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Agar page change ho raha hai to page number rakho, warna 1 par reset karo
      page: key === 'page' ? value : 1,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange('keyword', localSearch);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      sort: 'newest',
      page: 1,
    });
    setLocalSearch('');
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, val]) =>
      val &&
      val !== 'newest' &&
      val !== 1 &&
      ['category', 'minPrice', 'maxPrice', 'size', 'color', 'keyword'].includes(key)
  ).length;

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'discount', label: 'Best Discount' },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 md:py-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Collection
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3 capitalize">
            {filters.category ? filters.category.replace('-', ' ') : 'All Products'}
          </h1>
          <p className="text-sm text-brand-grey">
            {total} {total === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="container-brand py-10 md:py-14">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-gold transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium border border-gray-300 px-4 py-3 hover:border-brand-gold transition"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="text-xs uppercase tracking-[0.15em] font-medium border border-gray-300 px-4 py-3 focus:border-brand-gold focus:outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="lg:sticky lg:top-32 space-y-8">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h3 className="font-heading text-lg">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[10px] uppercase tracking-widest text-brand-gold hover:underline">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4">Category</h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="accent-brand-gold"
                    />
                    <span className="text-sm text-brand-grey group-hover:text-brand-black transition">All</span>
                  </label>
                  
                  {categoriesList.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.slug}
                        onChange={() => handleFilterChange('category', cat.slug)}
                        className="accent-brand-gold"
                      />
                      <span className="text-sm text-brand-grey group-hover:text-brand-black transition capitalize">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                  />
                  <span className="text-brand-grey">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Sizes */}
              {filterOptions?.sizes?.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                        className={`px-3 py-1.5 text-xs border transition ${
                          filters.size === size
                            ? 'bg-brand-black text-white border-brand-black'
                            : 'border-gray-300 hover:border-brand-gold'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {filterOptions?.colors?.length > 0 && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-4">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleFilterChange('color', filters.color === color ? '' : color)}
                        className={`px-3 py-1.5 text-xs border transition ${
                          filters.color === color
                            ? 'bg-brand-black text-white border-brand-black'
                            : 'border-gray-300 hover:border-brand-gold'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <ProductList products={products} loading={loading} emptyMessage="Koi product nahi mila. Filters change karein." />
            
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handleFilterChange('page', Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-sm hover:border-brand-gold disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  ←
                </button>
                {[...Array(pages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (pages > 7 && pageNum !== 1 && pageNum !== pages && Math.abs(pageNum - page) > 1) {
                    if (pageNum === 2 || pageNum === pages - 1) return <span key={i} className="text-brand-grey">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`w-10 h-10 border text-sm transition ${
                        page === pageNum ? 'bg-brand-black text-white border-brand-black' : 'border-gray-300 hover:border-brand-gold'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handleFilterChange('page', Math.min(pages, page + 1))}
                  disabled={page === pages}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-sm hover:border-brand-gold disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;