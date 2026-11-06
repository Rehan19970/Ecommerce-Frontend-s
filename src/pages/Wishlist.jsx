import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { addToCart } from '../features/cartSlice';

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [userInfo, navigate]);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter((p) => p._id !== productId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
          size: product.sizes?.[0] || '',
          color: product.colors?.[0] || '',
        })
      ).unwrap();
      alert('✓ Cart mein add ho gaya!');
    } catch (error) {
      alert('✗ ' + error);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container-brand section-padding">
        <div className="h-10 bg-brand-lightgrey w-64 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-3/4 bg-brand-lightgrey"></div>
              <div className="h-3 bg-brand-lightgrey mt-4 w-3/4"></div>
              <div className="h-3 bg-brand-lightgrey mt-2 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty
  if (wishlist.length === 0) {
    return (
      <div className="container-brand section-padding">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 border border-gray-200 rounded-full mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-brand-grey"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Empty
          </p>
          <h2 className="font-heading text-3xl mb-3">
            Wishlist Khaali Hai
          </h2>
          <p className="text-sm text-brand-grey mb-8">
            Products save karein aur baad mein dekhein
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500"
          >
            Shop Now
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 md:py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Saved Items
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">
            My Wishlist
          </h1>
          <p className="text-sm text-brand-grey">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container-brand py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map((product) => {
            const finalPrice =
              product.discountPrice > 0 ? product.discountPrice : product.price;
            const hasDiscount = product.discountPrice > 0;

            return (
              <div key={product._id} className="group">
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-brand-lightgrey">
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </Link>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-4 right-4 w-9 h-9 bg-white flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>

                {/* Info */}
                <div className="pt-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-brand-gold transition">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-semibold">
                      Rs. {finalPrice?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-brand-grey line-through">
                        Rs. {product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-brand-black text-white py-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;