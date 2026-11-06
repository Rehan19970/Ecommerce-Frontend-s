import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

const TrackOrder = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Agar user login hai, to uske orders fetch karo
  useEffect(() => {
    if (userInfo) {
      const fetchMyOrders = async () => {
        try {
          const { data } = await api.get('/orders/myorders');
          setMyOrders(data);
        } catch (err) {
          console.error('Orders fetch error:', err);
        }
      };
      fetchMyOrders();
    }
  }, [userInfo]);

  // Manual tracking (agar user login nahi hai)
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      let cleanId = orderId.trim().replace(/#/g, '');
      const { data } = await api.get(`/orders/track/${cleanId}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Order nahi mila. ID check karein.');
    } finally {
      setLoading(false);
    }
  };

  // Jab user apne order par click kare
  const handleOrderClick = (selectedOrder) => {
    setOrder(selectedOrder);
    // Scroll to top taake detail dikh sake
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Detail ka UI (jo dono jagah use hoga)
  const renderOrderDetail = () => (
    <div className="bg-white border border-gray-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-grey mb-1">Order ID</p>
          <p className="font-heading text-lg">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`px-3 py-1 text-xs uppercase tracking-widest font-medium border ${
          order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
          order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
          'bg-yellow-50 text-yellow-700 border-yellow-200'
        }`}>
          {order.orderStatus}
        </span>
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <p><span className="text-brand-grey">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><span className="text-brand-grey">Total:</span> Rs. {order.totalPrice}</p>
        <p><span className="text-brand-grey">Payment:</span> {order.paymentMethod}</p>
      </div>

      {order.statusHistory?.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-[10px] uppercase tracking-widest text-brand-grey mb-3">Timeline</p>
          <div className="space-y-3">
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-2 h-2 bg-brand-gold rounded-full mt-1.5 flex-shrink-0"></span>
                <div>
                  <p className="font-medium">{h.status}</p>
                  <p className="text-xs text-brand-grey">{new Date(h.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Order Status
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">Track Order</h1>
          <p className="text-sm text-brand-grey">
            {userInfo ? 'Aapke saare orders yahan hain' : 'Apna Order ID dalein aur status check karein'}
          </p>
        </div>
      </div>

      <div className="container-brand py-12 max-w-3xl">
        
        {/* Agar User Login Hai */}
        {userInfo ? (
          <div>
            {/* Order Detail View (Agar koi select kiya hai) */}
            {order ? (
              <div>
                <button 
                  onClick={() => setOrder(null)} 
                  className="text-sm text-brand-grey hover:text-brand-black mb-4 flex items-center gap-2"
                >
                  ← Back to My Orders
                </button>
                {renderOrderDetail()}
              </div>
            ) : (
              // Orders List View
              <div>
                <h2 className="font-heading text-2xl mb-6">My Orders</h2>
                {myOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 border border-dashed">
                    <p className="text-brand-grey">Aapne abhi tak koi order place nahi kiya.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myOrders.map((o) => (
                      <div 
                        key={o._id} 
                        onClick={() => handleOrderClick(o)}
                        className="bg-white border border-gray-200 p-5 cursor-pointer hover:border-brand-gold transition"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-brand-grey">Order ID</p>
                            <p className="font-medium">#{o._id.slice(-8).toUpperCase()}</p>
                          </div>
                          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                            o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm font-semibold mb-1">Rs. {o.totalPrice}</p>
                        <p className="text-xs text-brand-grey">{new Date(o.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-brand-gold mt-3 font-medium">Click to view details →</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Agar User Login Nahi Hai (Manual Tracking)
          <div>
            <form onSubmit={handleTrack} className="flex gap-2 mb-8">
              <input
                type="text"
                placeholder="e.g. #E2C6FDC3 ya 6aeace0135516de1aa6a4783"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-black text-white px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm border-l-2 border-red-500 mb-6">
                {error}
              </div>
            )}

            {order && renderOrderDetail()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;