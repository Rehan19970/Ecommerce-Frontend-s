import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeCartDrawer,
  openCartDrawer,
} from '../features/uiSlice';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
} from '../features/cartSlice';
import toast from 'react-hot-toast';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { cartDrawerOpen } = useSelector((state) => state.ui);
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Body scroll lock
  useEffect(() => {
    if (cartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cartDrawerOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') dispatch(closeCartDrawer());
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dispatch]);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item hataya gaya');
  };

  const shipping = totalPrice >= 5000 ? 0 : 200;

  if (!cartDrawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-60 transition-opacity duration-300"
        onClick={() => dispatch(closeCartDrawer())}
      ></div>

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-70 shadow-2xl flex flex-col transform transition-transform duration-300"
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="font-heading text-xl">Shopping Bag</h2>
            <p className="text-xs text-brand-grey mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => dispatch(closeCartDrawer())}
            className="w-8 h-8 flex items-center justify-center text-brand-grey hover:text-brand-black hover:bg-brand-cream transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 border border-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-brand-grey"
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
              <p className="font-heading text-lg mb-2">Cart Khali Hai</p>
              <p className="text-sm text-brand-grey mb-6">
                Shopping shuru karein aur apne pasandeeda items add karein
              </p>
              <button
                onClick={() => dispatch(closeCartDrawer())}
                className="bg-brand-black text-white px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item._id} className="p-5 flex gap-4">
                  <Link
                    to={`/products/${item.product}`}
                    onClick={() => dispatch(closeCartDrawer())}
                    className="w-20 h-28 shrink-0 bg-brand-lightgrey overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product}`}
                      onClick={() => dispatch(closeCartDrawer())}
                      className="font-medium text-sm line-clamp-2 hover:text-brand-gold transition"
                    >
                      {item.name}
                    </Link>

                    <div className="text-[10px] text-brand-grey mt-1 space-x-2">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>

                    <p className="font-semibold text-sm mt-2">
                      Rs. {item.price?.toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center hover:bg-brand-cream disabled:opacity-30 text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center text-xs font-medium border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-brand-cream text-sm"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-[10px] uppercase tracking-widest text-brand-grey hover:text-red-600 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-5 bg-brand-cream">
            {/* Free Shipping Progress */}
            {shipping > 0 && (
              <div className="mb-4 p-3 bg-white border border-gray-200">
                <p className="text-xs text-brand-grey mb-2">
                  Add{' '}
                  <span className="font-medium text-brand-black">
                    Rs. {(5000 - totalPrice)?.toLocaleString()}
                  </span>{' '}
                  more for{' '}
                  <span className="text-green-600 font-medium">
                    FREE Shipping
                  </span>
                </p>
                <div className="h-1 bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-brand-gold transition-all duration-500"
                    style={{
                      width: `${Math.min((totalPrice / 5000) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 mb-4 text-sm">
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
              <div className="flex justify-between pt-2 border-t border-gray-300 font-heading text-base">
                <span>Total</span>
                <span>Rs. {(totalPrice + shipping)?.toLocaleString()}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                to="/checkout"
                onClick={() => dispatch(closeCartDrawer())}
                className="block w-full bg-brand-black text-white text-center py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition"
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={() => dispatch(closeCartDrawer())}
                className="block w-full text-center py-3 text-xs uppercase tracking-[0.2em] font-medium text-brand-black border border-gray-300 hover:border-brand-black transition"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Animation */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;