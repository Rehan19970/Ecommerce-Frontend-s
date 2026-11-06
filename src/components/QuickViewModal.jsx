import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  closeQuickView,
  openCartDrawer,
} from '../features/uiSlice';
import { addToCart } from '../features/cartSlice';
import api from '../services/api';

const QuickViewModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { quickViewProduct: product } = useSelector((state) => state.ui);
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  // Reset state jab product change ho
  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      setWishlisted(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  // ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') dispatch(closeQuickView());
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dispatch]);

  if (!product) return null;

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error('Pehle login karein');
      dispatch(closeQuickView());
      navigate('/login');
      return;
    }

    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Size select karein');
      return;
    }

    setAdding(true);
    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        })
      ).unwrap();
      toast.success('Cart mein add ho gaya');
      dispatch(closeQuickView());
      dispatch(openCartDrawer());
    } catch (error) {
      toast.error(error || 'Kuch masla ho gaya');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!userInfo) {
      toast.error('Pehle login karein');
      navigate('/login');
      return;
    }

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
    }
  };

  const handleViewFull = () => {
    dispatch(closeQuickView());
    navigate(`/products/${product._id}`);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-80"
        onClick={() => dispatch(closeQuickView())}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-90 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white max-w-4xl w-full my-8 relative animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => dispatch(closeQuickView())}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white text-brand-grey hover:text-brand-black hover:bg-brand-cream transition"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* ===== Left — Images ===== */}
            <div className="p-6 md:p-8">
              {/* Main Image */}
              <div className="relative aspect-3/4 overflow-hidden bg-brand-lightgrey mb-4">
                <img
                  src={product.images?.[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNewArrival && (
                    <span className="bg-brand-black text-white text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5">
                      New
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-brand-gold text-white text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5">
                      -{product.discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-3/4 overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === i
                          ? 'border-brand-gold'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ===== Right — Info ===== */}
            <div className="p-6 md:p-8 md:pl-0">
              {/* Category */}
              {product.category?.name && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
                  {product.category.name}
                </p>
              )}

              {/* Title */}
              <h2 className="font-heading text-2xl md:text-3xl mb-3 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? 'text-brand-gold'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-brand-grey">
                    {product.rating.toFixed(1)} ({product.numReviews})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-200">
                <span className="text-2xl md:text-3xl font-semibold">
                  Rs. {finalPrice?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-brand-grey line-through">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    <span className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-1 font-medium">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="mb-4">
                {isOutOfStock ? (
                  <p className="text-sm text-red-600 font-medium">
                    ✕ Out of Stock
                  </p>
                ) : isLowStock ? (
                  <p className="text-sm text-orange-600 font-medium">
                    ⚠ Only {product.stock} left
                  </p>
                ) : (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ In Stock
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-brand-grey leading-relaxed mb-5 line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2">
                    Size: <span className="text-brand-grey ml-1">{selectedSize}</span>
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 px-3 py-2 text-xs border transition-all duration-300 ${
                          selectedSize === size
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
              {product.colors?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2">
                    Color: <span className="text-brand-grey ml-1">{selectedColor}</span>
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 text-xs border transition-all duration-300 ${
                          selectedColor === color
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

              {/* Quantity */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2">
                  Quantity
                </h4>
                <div className="flex items-center border border-gray-300 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center hover:bg-brand-cream disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-10 h-9 flex items-center justify-center text-xs font-medium border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 flex items-center justify-center hover:bg-brand-cream disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  className="flex-1 bg-brand-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isOutOfStock ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleWishlist}
                  className={`w-12 border transition ${
                    wishlisted
                      ? 'bg-brand-gold border-brand-gold text-white'
                      : 'border-gray-300 hover:border-brand-gold hover:text-brand-gold'
                  }`}
                  aria-label="Wishlist"
                >
                  <svg
                    className="w-5 h-5 mx-auto"
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
              </div>

              {/* View Full Details */}
              <button
                onClick={handleViewFull}
                className="w-full text-center text-xs uppercase tracking-[0.2em] text-brand-grey hover:text-brand-gold transition py-2 border-b border-transparent hover:border-brand-gold"
              >
                View Full Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;