import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { clearCart } from '../features/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: userInfo?.name || '',
    phone: userInfo?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'COD',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = totalPrice >= 5000 ? 0 : 200;
  const finalTotal = totalPrice + shipping - discount;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponMessage({ type: '', text: '' });

    try {
      const { data } = await api.post('/coupons/apply', {
        code: couponCode,
        orderAmount: totalPrice,
      });
      setDiscount(data.discount);
      setCouponMessage({
        type: 'success',
        text: `✓ ${data.coupon.code} applied — Rs. ${data.discount.toLocaleString()} off`,
      });
    } catch (err) {
      setDiscount(0);
      setCouponMessage({
        type: 'error',
        text: err.response?.data?.message || 'Coupon galat hai',
      });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      await api.post('/orders', {
        orderItems,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        couponCode: couponCode || '',
        discount,
      });

      await dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Order place nahi ho saka');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  const cities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot', 'Gujranwala',
  ];

  return (
    <div className="bg-white">
      {/* ===== Page Header ===== */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 md:py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Step 2 of 2
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">Checkout</h1>
          <p className="text-sm text-brand-grey">
            Apni details fill karein aur order confirm karein
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <form onSubmit={handleSubmit} className="container-brand py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* ===== Left — Form ===== */}
          <div className="lg:col-span-2 space-y-8">
            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border-l-2 border-red-500 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Shipping Address */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 bg-brand-black text-white flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <h2 className="font-heading text-xl">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Ahmed Khan"
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="03001234567"
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House #, Street, Area"
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition cursor-pointer"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="54000 (optional)"
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 bg-brand-black text-white flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <h2 className="font-heading text-xl">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    val: 'COD',
                    label: 'Cash on Delivery',
                    desc: 'Delivery par cash dein',
                    icon: '💵',
                  },
                  {
                    val: 'JazzCash',
                    label: 'JazzCash',
                    desc: 'Mobile wallet se pay karein',
                    icon: '📱',
                  },
                  {
                    val: 'Easypaisa',
                    label: 'Easypaisa',
                    desc: 'Mobile wallet se pay karein',
                    icon: '📱',
                  },
                ].map((method) => (
                  <label
                    key={method.val}
                    className={`flex items-center gap-4 p-5 border cursor-pointer transition-all duration-300 ${
                      formData.paymentMethod === method.val
                        ? 'border-brand-gold bg-brand-cream'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.val}
                      checked={formData.paymentMethod === method.val}
                      onChange={handleChange}
                      className="accent-brand-gold"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-brand-grey">{method.desc}</p>
                    </div>
                    {formData.paymentMethod === method.val && (
                      <span className="text-brand-gold text-lg">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Right — Summary ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 bg-brand-cream border border-gray-200 p-6 md:p-8">
              <h3 className="font-heading text-xl mb-6 pb-4 border-b border-gray-200">
                Order Summary
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="relative w-16 h-20 bg-white shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-brand-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-brand-grey mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-xs font-medium mt-1">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-3">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    className="flex-1 px-3 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={applyingCoupon}
                    className="bg-brand-black text-white px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-gold transition disabled:opacity-50"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
                {couponMessage.text && (
                  <p
                    className={`text-xs mt-2 ${
                      couponMessage.type === 'success'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-gray-200">
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

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      − Rs. {discount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-heading text-lg">Total</span>
                <span className="font-heading text-2xl">
                  Rs. {finalTotal?.toLocaleString()}
                </span>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-brand-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="block text-center mt-4 text-xs uppercase tracking-[0.2em] text-brand-grey hover:text-brand-gold transition"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;