import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-brand-cream">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <p className="font-heading text-[120px] md:text-[180px] leading-none text-brand-gold/20 mb-4">
          404
        </p>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 border border-gray-300 rounded-full mb-6 -mt-16 bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-brand-grey"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
          Not Found
        </p>
        <h1 className="font-heading text-4xl md:text-5xl mb-4">
          Page Nahi Mila
        </h1>
        <p className="text-sm text-brand-grey mb-10 leading-relaxed">
          Lagta hai aap kisi aisi page par pohanch gaye hain jo exist nahi
          karta. Ghabrayen nahi — neeche wale button se ghar wapas chalein.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-3 bg-brand-black text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500"
          >
            Back to Home
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-3 border border-brand-black text-brand-black px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-black hover:text-white transition-all duration-500"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;