import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchProductById,
  fetchRelatedProducts,
  clearSingleProduct,
} from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import { openCartDrawer } from '../features/uiSlice';
import ProductList from '../components/ProductList';
import ImageZoom from '../components/ImageZoom';
import SizeGuideModal from '../components/SizeGuideModal';
import ReviewsSection from '../components/ReviewsSection';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // ===== Fetch product =====
  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchRelatedProducts(id)).then((res) => {
      if (res.payload) setRelated(res.payload);
    });
    return () => dispatch(clearSingleProduct());
  }, [dispatch, id]);

  // ===== Reset selections =====
  useEffect(() => {
    if (product?.sizes?.length > 0) setSelectedSize(product.sizes[0]);
    else setSelectedSize('');
    if (product?.colors?.length > 0) setSelectedColor(product.colors[0]);
    else setSelectedColor('');
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  // ===== Wishlist status fetch (agar user logged in) =====
  useEffect(() => {
    if (!userInfo || !product?._id) {
      setWishlisted(false);
      return;
    }
    let cancelled = false;
    api
      .get(`/wishlist/check/${product._id}`)
      .then(({ data }) => {
        if (!cancelled) setWishlisted(!!data.inWishlist);
      })
      .catch(() => {
        // Endpoint na ho to chup chaap ignore
      });
    return () => {
      cancelled = true;
    };
  }, [userInfo, product?._id]);

  // ===== Sticky bar on scroll =====
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ===== Color change → images update =====
  useEffect(() => {
    if (!product) return;
    if (product.colorImages?.length > 0 && selectedColor) {
      const colorData = product.colorImages.find(
        (ci) => ci.color === selectedColor
      );
      if (colorData?.images?.length > 0) {
        setCurrentImages(colorData.images);
        setSelectedImage(0);
        return;
      }
    }
    setCurrentImages(product.images || []);
    setSelectedImage(0);
  }, [product, selectedColor]);

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error('Pehle login karein');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
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
      dispatch(openCartDrawer());
    } catch (error) {
      toast.error(error || 'Kuch masla ho gaya');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!userInfo) {
      toast.error('Pehle login karein');
      navigate('/login');
      return;
    }
    if (wishlistLoading) return;
    setWishlistLoading(true);
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
    } catch {
      toast.error('Kuch masla ho gaya');
    } finally {
      setWishlistLoading(false);
    }
  };

  // ===== Skeleton =====
  if (loading || !product) {
    return (
      <div className="container-brand py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-brand-lightgrey"></div>
          <div className="space-y-4 pt-4">
            <div className="h-3 bg-brand-lightgrey w-1/4"></div>
            <div className="h-8 bg-brand-lightgrey w-3/4"></div>
            <div className="h-4 bg-brand-lightgrey w-1/3"></div>
            <div className="h-6 bg-brand-lightgrey w-1/4 mt-6"></div>
            <div className="h-20 bg-brand-lightgrey w-full mt-6"></div>
            <div className="h-12 bg-brand-lightgrey w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const activeImage =
    currentImages?.[selectedImage] || product.images?.[0] || '';

  const detailsList = product.details
    ? product.details.split('\n').map((l) => l.trim()).filter(Boolean)
    : [];

  const careList = product.careInstructions
    ? product.careInstructions.split('\n').map((l) => l.trim()).filter(Boolean)
    : [];

  const rating = Number(product.rating) || 0;
  const numReviews = Number(product.numReviews) || 0;

  return (
    <div className="bg-white">
      {/* ===== Breadcrumb ===== */}
      <div className="border-b border-gray-100">
        <div className="container-brand py-4">
          <nav className="text-xs text-brand-grey flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-brand-gold transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-brand-gold transition">
              Products
            </Link>
            {product.category?.name && (
              <>
                <span>/</span>
                <Link
                  to={`/products?category=${
                    product.category.slug || product.category._id
                  }`}
                  className="hover:text-brand-gold transition"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-brand-black truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ===== Main Section ===== */}
      <div className="container-brand py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ===== LEFT — Images ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative mb-4">
              {activeImage ? (
                <ImageZoom src={activeImage} alt={product.name} />
              ) : (
                <div className="aspect-[3/4] bg-brand-lightgrey flex flex-col items-center justify-center text-brand-grey">
                  <span className="text-4xl mb-2">📷</span>
                  <p className="text-xs">No image available</p>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
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
                {isLowStock && (
                  <span className="bg-orange-500 text-white text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-1.5">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-all duration-300 z-10 disabled:opacity-60 ${
                  wishlisted
                    ? 'bg-brand-gold text-white'
                    : 'bg-white text-brand-black hover:bg-brand-gold hover:text-white'
                }`}
                aria-label="Wishlist"
              >
                <svg
                  className="w-5 h-5"
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

            {/* Thumbnails */}
            {currentImages?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {currentImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-[3/4] overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-brand-gold'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-lightgrey" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT — Info ===== */}
          <div className="lg:pt-2">
            {product.category?.name && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
                {product.category.name}
              </p>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            {rating > 0 && (
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  document
                    .getElementById('product-tabs')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-3 mb-6 group"
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(rating)
                          ? 'text-brand-gold'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-brand-grey group-hover:text-brand-gold transition">
                  {rating.toFixed(1)} ({numReviews} reviews)
                </span>
              </button>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-gray-200 flex-wrap">
              <span className="text-3xl md:text-4xl font-semibold">
                Rs. {Number(finalPrice).toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-brand-grey line-through">
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                  <span className="text-xs bg-brand-gold/10 text-brand-gold px-2 py-1 font-medium">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mb-5">
              {isOutOfStock ? (
                <p className="text-sm text-red-600 font-medium">
                  ✕ Out of Stock
                </p>
              ) : isLowStock ? (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠ Only {product.stock} left in stock — order jaldi karein!
                </p>
              ) : (
                <p className="text-sm text-green-600 font-medium">✓ In Stock</p>
              )}
            </div>

            {/* SHORT DESCRIPTION */}
            {product.shortDescription && (
              <p className="text-sm text-brand-grey leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Trust badges strip */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: '✦', label: 'Premium Quality' },
                { icon: '↩', label: 'Easy Returns' },
                { icon: '🚚', label: 'Fast Delivery' },
              ].map((b, i) => (
                <div key={i} className="text-center p-3 border border-gray-200">
                  <span className="text-lg block mb-1 text-brand-gold">
                    {b.icon}
                  </span>
                  <p className="text-[9px] uppercase tracking-widest text-brand-grey">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Fabric quick line */}
            {product.fabric && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-brand-grey">
                    Fabric:
                  </span>{' '}
                  <span className="font-medium">{product.fabric}</span>
                </p>
              </div>
            )}

            {/* COLORS */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3">
                  Color:{' '}
                  <span className="text-brand-grey ml-1">{selectedColor}</span>
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => {
                    const hasColorImages = product.colorImages?.some(
                      (ci) => ci.color === color && ci.images?.length > 0
                    );
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2.5 text-xs border transition-all duration-300 relative ${
                          selectedColor === color
                            ? 'bg-brand-black text-white border-brand-black'
                            : 'border-gray-300 hover:border-brand-gold'
                        }`}
                      >
                        {color}
                        {hasColorImages && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-gold rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZES */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium">
                    Size:{' '}
                    <span className="text-brand-grey ml-1">{selectedSize}</span>
                  </h4>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[10px] uppercase tracking-widest text-brand-grey hover:text-brand-gold underline transition"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-4 py-2.5 text-xs border transition-all duration-300 ${
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

            {/* QUANTITY */}
            <div className="mb-6">
              <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium mb-3">
                Quantity
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-11 h-11 flex items-center justify-center hover:bg-brand-cream transition disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-14 h-11 flex items-center justify-center border-x border-gray-300 text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock || 1, q + 1))
                    }
                    disabled={quantity >= product.stock}
                    className="w-11 h-11 flex items-center justify-center hover:bg-brand-cream transition disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-brand-grey">Max: {product.stock}</p>
              </div>
            </div>

            {/* ADD TO CART */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className="group flex-1 bg-brand-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : addingToCart
                  ? 'Adding...'
                  : 'Add to Cart'}
                {!isOutOfStock && !addingToCart && (
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                )}
              </button>
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className={`w-14 border transition-all duration-300 disabled:opacity-60 ${
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

            {/* Shipping info */}
            <div className="pt-6 border-t border-gray-200 space-y-3">
              {[
                { icon: '🚚', text: 'Free shipping on orders above Rs. 5,000' },
                { icon: '↩️', text: '7 days easy returns & exchange' },
                {
                  icon: '🔒',
                  text: 'Secure payment — COD, JazzCash, Easypaisa',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-xs text-brand-grey"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div id="product-tabs" className="bg-white border-t border-gray-200">
        <div className="container-brand">
          <div className="flex gap-6 md:gap-8 border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'description', label: 'Description' },
              { key: 'details', label: 'Details' },
              { key: 'care', label: 'Care & Fabric' },
              { key: 'reviews', label: `Reviews (${numReviews})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-5 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-brand-grey hover:text-brand-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-10 max-w-4xl">
            {/* DESCRIPTION */}
            {activeTab === 'description' && (
              <div>
                {product.description ? (
                  <div className="text-sm text-brand-grey leading-loose whitespace-pre-line">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-sm text-brand-grey">
                    Description available nahi.
                  </p>
                )}
              </div>
            )}

            {/* DETAILS */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Product Highlights
                  </p>
                  {detailsList.length > 0 ? (
                    <ul className="space-y-2.5">
                      {detailsList.map((line, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-brand-grey"
                        >
                          <span className="text-brand-gold mt-0.5">✦</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-brand-grey">
                      Details available nahi.
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Specifications
                  </p>
                  <div className="border border-gray-200 divide-y divide-gray-200">
                    {[
                      { label: 'SKU', value: product.sku || 'N/A' },
                      { label: 'Brand', value: product.brand || 'Roshys' },
                      { label: 'Fabric', value: product.fabric || 'N/A' },
                      {
                        label: 'Category',
                        value: product.category?.name || 'N/A',
                      },
                      {
                        label: 'Available Sizes',
                        value: product.sizes?.join(', ') || 'N/A',
                      },
                      {
                        label: 'Available Colors',
                        value: product.colors?.join(', ') || 'N/A',
                      },
                      {
                        label: 'Stock',
                        value:
                          product.stock > 0
                            ? `${product.stock} units`
                            : 'Out of stock',
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between px-4 py-3"
                      >
                        <span className="text-[10px] uppercase tracking-widest text-brand-grey">
                          {item.label}
                        </span>
                        <span className="text-sm text-brand-black font-medium text-right ml-4">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CARE */}
            {activeTab === 'care' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Fabric
                  </p>
                  <p className="text-sm text-brand-grey leading-relaxed">
                    {product.fabric || 'Fabric information available nahi.'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Care Instructions
                  </p>
                  {careList.length > 0 ? (
                    <ul className="space-y-2.5">
                      {careList.map((line, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-brand-grey"
                        >
                          <span className="text-brand-gold mt-0.5">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-brand-grey">
                      Dry clean recommended. Iron on low heat. Do not bleach.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <ReviewsSection
                product={product}
                onRefresh={() => dispatch(fetchProductById(id))}
              />
            )}
          </div>
        </div>
      </div>

      {/* ===== Related ===== */}
      {related?.length > 0 && (
        <section className="container-brand section-padding">
          <div className="text-center mb-12" data-aos="fade-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              You May Also Like
            </p>
            <h2 className="font-heading text-3xl md:text-4xl mb-3">
              Related Products
            </h2>
            <div className="w-16 h-px bg-brand-gold mx-auto"></div>
          </div>
          <ProductList products={related} />
        </section>
      )}

      {/* ===== Size Guide Modal ===== */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      {/* ===== Sticky Add to Cart Bar ===== */}
      {showStickyBar && !isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 py-3 px-4 md:px-8">
          <div className="container-brand flex items-center gap-3 md:gap-4">
            <div className="hidden md:block w-12 h-16 bg-brand-lightgrey flex-shrink-0 overflow-hidden">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-lightgrey" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium truncate">
                {product.name}
              </p>
              <p className="text-sm font-semibold">
                Rs. {Number(finalPrice).toLocaleString()}
                {hasDiscount && (
                  <span className="text-xs text-brand-grey line-through ml-2">
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-brand-black text-white px-4 md:px-6 py-2.5 md:py-3 text-[10px] md:text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition disabled:opacity-50 whitespace-nowrap"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;