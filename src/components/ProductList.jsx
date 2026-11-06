import ProductCard from './ProductCard';

const ProductList = ({
  products,
  loading,
  emptyMessage = 'Koi product nahi mila',
  columns = 4,
}) => {
  if (loading) {
    const skeletonCount = columns * 2;
    return (
      <div
        className={`grid gap-6 md:gap-8 ${
          columns === 4
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : columns === 3
            ? 'grid-cols-2 md:grid-cols-3'
            : 'grid-cols-2'
        }`}
      >
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-brand-lightgrey aspect-3/4"></div>
            <div className="pt-4 space-y-2">
              <div className="h-2 bg-brand-lightgrey w-1/3"></div>
              <div className="h-3 bg-brand-lightgrey w-full"></div>
              <div className="h-3 bg-brand-lightgrey w-2/3"></div>
              <div className="h-4 bg-brand-lightgrey w-1/2 mt-3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 px-4" data-aos="fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 border border-gray-200 rounded-full mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-brand-grey"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-brand-black mb-2">
          Kuch Nahi Mila
        </h3>
        <p className="text-sm text-brand-grey max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-6 md:gap-8 ${
        columns === 4
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : columns === 3
          ? 'grid-cols-2 md:grid-cols-3'
          : 'grid-cols-2'
      }`}
    >
      {products.map((product, i) => (
        <div
          key={product._id}
          data-aos="fade-up"
          data-aos-delay={(i % 4) * 100}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;