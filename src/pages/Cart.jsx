import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
} from '../features/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, userInfo, navigate]);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      dispatch(removeFromCart(itemId));
    }
  };

  const shipping = totalPrice >= 5000 ? 0 : 200;
  const total = totalPrice + shipping;

  // ===== Loading =====
  if (loading) {
    return (
      <div className="container-brand section-padding">
        <div className="h-8 bg-brand-lightgrey w-64 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-32 h-40 bg-brand-lightgrey"></div>
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-3 bg-brand-lightgrey w-3/4"></div>
                  <div className="h-3 bg-brand-lightgrey w-1/3"></div>
                  <div className="h-3 bg-brand-lightgrey w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-brand-lightgrey animate-pulse"></div>
        </div>
      </div>
    );
  }

  // ===== Empty Cart =====
  if (cartItems.length === 0) {
    return (
      <div className="container-brand section-padding">
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Empty
          </p>
          <h2 className="font-heading text-3xl md:text-4xl mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-sm text-brand-grey mb-8 leading-relaxed">
            Lagta hai aapne abhi tak kuch add nahi kiya. Shopping shuru karein
            aur apne pasandeeda items cart mein daalein.
          </p>

          <Link
            to="/products"
            className="group inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500"
          >
            Start Shopping
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
      {/* ===== Page Header ===== */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 md:py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Shopping Bag
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">
            Your Cart
          </h1>
          <p className="text-sm text-brand-grey">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="container-brand py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* ===== Cart Items ===== */}
          <div className="lg:col-span-2">
            {/* Table Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 items-center"
                >
                  {/* Product Info */}
                  <div className="md:col-span-6 flex gap-4">
                    <Link
                      to={`/products/${item.product}`}
                      className="w-24 h-32 shrink-0 overflow-hidden bg-brand-lightgrey"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 py-1">
                      <Link
                        to={`/products/${item.product}`}
                        className="font-medium text-sm hover:text-brand-gold transition line-clamp-2 mb-2"
                      >
                        {item.name}
                      </Link>

                      <div className="space-y-1 text-xs text-brand-grey">
                        {item.size && (
                          <p>
                            <span className="uppercase tracking-widest">Size:</span>{' '}
                            <span className="text-brand-black">{item.size}</span>
                          </p>
                        )}
                        {item.color && (
                          <p>
                            <span className="uppercase tracking-widest">Color:</span>{' '}
                            <span className="text-brand-black">{item.color}</span>
                          </p>
                        )}
                      </div>

                      {/* Mobile Price */}
                      <p className="md:hidden font-medium text-sm mt-2">
                        Rs. {item.price?.toLocaleString()}
                      </p>

                      {/* Mobile Remove */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="md:hidden text-xs text-red-600 hover:underline mt-2 flex items-center gap-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price (Desktop) */}
                  <div className="hidden md:block md:col-span-2 text-center text-sm">
                    Rs. {item.price?.toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center hover:bg-brand-cream transition disabled:opacity-30"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-10 h-9 flex items-center justify-center border-x border-gray-300 text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="w-9 h-9 flex items-center justify-center hover:bg-brand-cream transition"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total + Remove (Desktop) */}
                  <div className="md:col-span-2 flex justify-between md:block md:text-right">
                    <p className="md:hidden text-xs uppercase tracking-widest text-brand-grey">
                      Subtotal
                    </p>
                    <div>
                      <p className="font-semibold text-sm">
                        Rs. {(item.price * item.quantity)?.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="hidden md:inline-flex items-center gap-1 text-xs text-brand-grey hover:text-red-600 transition mt-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium text-brand-black hover:text-brand-gold transition"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ===== Order Summary ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 bg-brand-cream border border-gray-200 p-6 md:p-8">
              <h3 className="font-heading text-xl mb-6 pb-4 border-b border-gray-200">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-brand-grey">Subtotal</span>
                  <span className="font-medium">
                    Rs. {totalPrice?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-brand-grey">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `Rs. ${shipping}`
                    )}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between text-base">
                  <span className="font-heading">Total</span>
                  <span className="font-heading text-xl">
                    Rs. {total?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Free shipping progress */}
              {shipping > 0 && (
                <div className="mb-6 p-3 bg-white border border-gray-200">
                  <p className="text-xs text-brand-grey mb-2">
                    Add <span className="font-medium text-brand-black">Rs. {(5000 - totalPrice)?.toLocaleString()}</span> more for{' '}
                    <span className="text-green-600 font-medium">FREE Shipping</span>
                  </p>
                  <div className="h-1 bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-brand-gold transition-all duration-500"
                      style={{ width: `${Math.min((totalPrice / 5000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="group w-full bg-brand-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 flex items-center justify-center gap-3"
              >
                Proceed to Checkout
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-xs text-brand-grey">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-brand-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-grey">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-brand-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>7 days easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-brand-grey">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-brand-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span>COD, JazzCash, Easypaisa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;