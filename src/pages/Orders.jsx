import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  const statusStyle = (status) => {
    const styles = {
      Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Processing: 'bg-blue-50 text-blue-700 border-blue-200',
      Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
      Cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Loading
  if (loading) {
    return (
      <div className="container-brand section-padding">
        <div className="h-10 bg-brand-lightgrey w-64 mb-8 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-brand-lightgrey animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Empty
  if (orders.length === 0) {
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            No Orders
          </p>
          <h2 className="font-heading text-3xl mb-3">Koi Order Nahi</h2>
          <p className="text-sm text-brand-grey mb-8">
            Aapne abhi tak koi order nahi kiya. Shopping shuru karein!
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
            Account
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">My Orders</h1>
          <p className="text-sm text-brand-grey">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="container-brand py-10 md:py-14 max-w-4xl">
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {/* Order Header */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey mb-1">
                    Order ID
                  </p>
                  <p className="font-medium text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey mb-1">
                    Date
                  </p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey mb-1">
                    Total
                  </p>
                  <p className="font-semibold text-sm">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[10px] uppercase tracking-widest font-medium px-3 py-1.5 border ${statusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Preview Images */}
              <div className="px-6 pb-4 flex items-center gap-2 overflow-x-auto">
                {order.orderItems?.slice(0, 5).map((item, i) => (
                  <div
                    key={i}
                    className="w-14 h-18 shrink-0 bg-brand-lightgrey"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.orderItems?.length > 5 && (
                  <span className="text-xs text-brand-grey ml-2">
                    +{order.orderItems.length - 5} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-2 flex flex-wrap justify-between items-center gap-3 border-t border-gray-100">
                <p className="text-xs text-brand-grey">
                  {order.orderItems?.length} item(s) • {order.paymentMethod}
                  {order.isPaid && ' • Paid'}
                </p>

                <button
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order._id ? null : order._id)
                  }
                  className="text-xs uppercase tracking-[0.15em] font-medium text-brand-black hover:text-brand-gold transition flex items-center gap-2"
                >
                  {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                  <span className="text-lg">
                    {expandedOrder === order._id ? '−' : '+'}
                  </span>
                </button>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="px-6 pb-6 pt-4 border-t border-gray-200 bg-brand-cream">
                  {/* Items */}
                  <h4 className="text-[10px] uppercase tracking-widest text-brand-grey mb-4 font-medium">
                    Items
                  </h4>
                  <div className="space-y-3 mb-6">
                    {order.orderItems?.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-12 h-16 bg-white shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-brand-grey mt-0.5">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `Color: ${item.color}`} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium whitespace-nowrap">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-brand-grey mb-2 font-medium">
                        Shipping Address
                      </h4>
                      <p className="text-sm">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p className="text-xs text-brand-grey">
                        {order.shippingAddress?.phone}
                      </p>
                      <p className="text-xs text-brand-grey">
                        {order.shippingAddress?.address},{' '}
                        {order.shippingAddress?.city}
                      </p>
                    </div>

                    {/* Timeline */}
                    {order.statusHistory?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-brand-grey mb-2 font-medium">
                          Order Timeline
                        </h4>
                        <div className="space-y-2">
                          {order.statusHistory.map((h, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs"
                            >
                              <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1.5 shrink-0"></span>
                              <div>
                                <p className="font-medium">{h.status}</p>
                                <p className="text-brand-grey text-[10px]">
                                  {new Date(h.date).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;