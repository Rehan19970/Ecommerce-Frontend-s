import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../features/cartSlice';
import { openCartDrawer, openQuickView } from '../features/uiSlice';
import api from '../services/api';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [wishlisted, setWishlisted] = useState(false);
  const [animating, setAnimating] = useState(false);

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const isNew = product.isNewArrival;
  const isSale = product.isOnSale;
  const isOutOfStock = product.stock === 0;

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openQuickView(product));
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error('Pehle login karein');
      navigate('/login');
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
          size: product.sizes?.[0] || '',
          color: product.colors?.[0] || '',
        })
      ).unwrap();
      toast.success('Cart mein add ho gaya');
      dispatch(openCartDrawer());
    } catch (error) {
      toast.error(error || 'Kuch masla ho gaya');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error('Pehle login karein');
      navigate('/login');
      return;
    }

    setAnimating(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product._id}`);
        setWishlisted(false);
        toast.success('Wishlist se hata diya');
      } else {
        await api.post('/wishlist', { productId: product._id });
        setWishlisted(true);
        toast.success('Wishlist mein add ho gaya');
      }
    } catch (error) {
      toast.error('Kuch masla ho gaya');
    } finally {
      setTimeout(() => setAnimating(false), 500);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="relative aspect-3/4 overflow-hidden bg-brand-lightgrey">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/600x800'}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            isOutOfStock ? 'opacity-50' : ''
          }`}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isNew && (
            <span className="bg-brand-black text-white text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5">
              New
            </span>
          )}
          {isSale && hasDiscount && (
            <span className="bg-brand-gold text-white text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5">
              -{product.discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-white text-brand-black text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className={`absolute top-4 right-4 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${
            wishlisted
              ? 'bg-brand-gold text-white opacity-100'
              : 'hover:bg-brand-gold hover:text-white'
          } ${animating ? 'scale-125' : 'scale-100'}`}
        >
          <svg
            className="w-4 h-4 transition-transform"
            fill={wishlisted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Bottom Actions */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button
              onClick={handleQuickView}
              className="flex-1 bg-white/95 backdrop-blur-sm text-brand-black text-[10px] uppercase tracking-[0.15em] font-medium py-3.5 hover:bg-brand-gold hover:text-white transition"
            >
              Quick View
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand-black text-white text-[10px] uppercase tracking-[0.15em] font-medium py-3.5 hover:bg-brand-gold transition"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        {product.category?.name && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey mb-1.5">
            {product.category.name}
          </p>
        )}

        <h3 className="font-medium text-sm text-brand-black line-clamp-2 min-h-10 group-hover:text-brand-gold transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-semibold text-brand-black">
            Rs. {finalPrice?.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-brand-grey line-through">
              Rs. {product.price?.toLocaleString()}
            </span>
          )}
        </div>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(product.rating)
                      ? 'text-brand-gold'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-brand-grey">
              ({product.numReviews})
            </span>
          </div>
        )}

        {product.sizes?.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {product.sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="text-[10px] border border-gray-200 text-brand-grey px-2 py-0.5 uppercase tracking-wider"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[10px] text-brand-grey">
                +{product.sizes.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;