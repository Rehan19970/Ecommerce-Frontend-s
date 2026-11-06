import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/searchService';

const SearchBar = ({ onClose, autoFocus = false, isMobile = false }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced search
  useEffect(() => {
    if (keyword.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    const timer = setTimeout(async () => {
      const results = await searchProducts(keyword);
      setSuggestions(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleProductClick(suggestions[selectedIndex]);
      } else if (keyword.trim()) {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      if (onClose) onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
      setKeyword('');
      setShowDropdown(false);
      if (onClose) onClose();
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product._id}`);
    setKeyword('');
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onClose) onClose();
  };

  const clearSearch = () => {
    setKeyword('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <svg
            className="w-5 h-5 text-brand-grey absolute left-4 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => keyword.length >= 2 && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className={`w-full pl-12 pr-12 py-3 bg-white border border-gray-200 text-sm focus:border-brand-gold focus:outline-none transition-colors ${
              isMobile ? 'rounded-full' : ''
            }`}
          />

          {/* Clear button */}
          {keyword && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 text-brand-grey hover:text-brand-black text-lg"
              aria-label="Clear"
            >
              ✕
            </button>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="absolute right-4">
              <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Close button (mobile overlay) */}
          {onClose && !loading && (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 text-brand-grey hover:text-brand-black text-xl"
              aria-label="Close search"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showDropdown && keyword.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-2xl z-50 max-h-100 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-sm text-brand-grey">Searching...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-brand-grey">
                Koi product nahi mila "{keyword}"
              </p>
              <p className="text-xs text-brand-grey mt-1">
                Doosra keyword try karein
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-2 border-b border-gray-100 bg-brand-cream">
                <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium">
                  {suggestions.length} results — Suggestions
                </p>
              </div>

              {/* Products */}
              <div className="divide-y divide-gray-100">
                {suggestions.map((product, index) => {
                  const finalPrice =
                    product.discountPrice > 0
                      ? product.discountPrice
                      : product.price;
                  const hasDiscount = product.discountPrice > 0;

                  return (
                    <button
                      key={product._id}
                      onClick={() => handleProductClick(product)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-4 p-3 text-left transition-colors ${
                        selectedIndex === index
                          ? 'bg-brand-cream'
                          : 'hover:bg-brand-cream'
                      }`}
                    >
                      <div className="w-12 h-16 bg-brand-lightgrey shrink-0 overflow-hidden">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {product.name}
                        </p>
                        {product.category?.name && (
                          <p className="text-[10px] uppercase tracking-widest text-brand-grey mt-0.5">
                            {product.category.name}
                          </p>
                        )}
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-semibold">
                            Rs. {finalPrice?.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-brand-grey line-through">
                              Rs. {product.price?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <svg
                        className="w-4 h-4 text-brand-grey shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* View All Footer */}
              <button
                onClick={handleSubmit}
                className="w-full text-center py-3 bg-brand-black text-white text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
              >
                View All Results for "{keyword}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;