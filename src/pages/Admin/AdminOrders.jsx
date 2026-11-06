import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
      // Refresh selected order
      const { data } = await api.get(`/orders/${orderId}`);
      setSelectedOrder(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Status update nahi hua');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeliver = async (orderId) => {
    if (!window.confirm('Mark as delivered?')) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${orderId}/deliver`);
      await fetchOrders();
      const { data } = await api.get(`/orders/${orderId}`);
      setSelectedOrder(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Deliver mark nahi hua');
    } finally {
      setUpdating(false);
    }
  };

  const statusColor = (status) => {
    const styles = {
      Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Processing: 'bg-blue-50 text-blue-700 border-blue-200',
      Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
      Cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Filter + search
  const filteredOrders = orders
    .filter((o) => (filter === 'all' ? true : o.orderStatus === filter))
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o._id.toLowerCase().includes(q) ||
        o.user?.name?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q)
      );
    });

  const statusCounts = {
    all: orders.length,
    Pending: orders.filter((o) => o.orderStatus === 'Pending').length,
    Processing: orders.filter((o) => o.orderStatus === 'Processing').length,
    Shipped: orders.filter((o) => o.orderStatus === 'Shipped').length,
    Delivered: orders.filter((o) => o.orderStatus === 'Delivered').length,
    Cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length,
  };

  return (
    <AdminLayout title="Orders">
      {/* ===== Header ===== */}
      <div className="bg-white border border-gray-200 p-4 md:p-5 mb-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <p className="text-sm text-brand-grey">
            <span className="font-semibold text-brand-black">{orders.length}</span>{' '}
            total orders
          </p>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by ID, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-grey"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
      </div>

      {/* ===== Filter Tabs ===== */}
      <div className="bg-white border border-gray-200 mb-5 overflow-x-auto">
        <div className="flex min-w-max">
          {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-3.5 text-xs uppercase tracking-widest font-medium whitespace-nowrap transition relative ${
                  filter === tab
                    ? 'text-brand-black'
                    : 'text-brand-grey hover:text-brand-black'
                }`}
              >
                {tab === 'all' ? 'All Orders' : tab}
                <span
                  className={`ml-2 text-[10px] px-1.5 py-0.5 ${
                    filter === tab
                      ? 'bg-brand-gold text-white'
                      : 'bg-gray-100 text-brand-grey'
                  }`}
                >
                  {statusCounts[tab]}
                </span>
                {filter === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"></span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* ===== Orders Table ===== */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-brand-grey">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <div className="inline-flex w-16 h-16 border border-gray-200 rounded-full items-center justify-center mb-4">
            <svg className="w-7 h-7 text-brand-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="font-heading text-lg mb-2">Koi order nahi mila</p>
          <p className="text-sm text-brand-grey">
            {search || filter !== 'all' ? 'Filter change karein' : 'Abhi tak koi order nahi'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream border-b border-gray-200">
                <tr className="text-left text-[10px] uppercase tracking-widest text-brand-grey">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Customer</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-brand-cream/50 transition cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-brand-grey mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell">
                      <p className="font-medium text-sm">
                        {order.user?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-brand-grey truncate max-w-45">
                        {order.user?.email}
                      </p>
                    </td>

                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex -space-x-2">
                        {order.orderItems?.slice(0, 3).map((item, i) => (
                          <div
                            key={i}
                            className="w-8 h-10 bg-brand-lightgrey border-2 border-white shrink-0"
                          >
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.orderItems?.length > 3 && (
                          <div className="w-8 h-10 bg-brand-black text-white text-[10px] border-2 border-white flex items-center justify-center">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-sm">
                        Rs. {order.totalPrice?.toLocaleString()}
                      </p>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${
                          order.isPaid
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <p className="text-[10px] text-brand-grey mt-1 uppercase tracking-widest">
                        {order.paymentMethod}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${statusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        className="text-xs text-brand-gold hover:underline uppercase tracking-widest font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Order Detail Modal ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full my-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-heading text-xl">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h2>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${statusColor(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-brand-grey">
                  {new Date(selectedOrder.createdAt).toLocaleString('en-PK')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center text-brand-grey hover:text-brand-black hover:bg-brand-cream transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Grid — Customer + Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer */}
                <div className="bg-brand-cream border border-gray-200 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium mb-3">
                    Customer
                  </p>
                  <p className="font-medium text-sm mb-1">
                    {selectedOrder.user?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-brand-grey">
                    {selectedOrder.user?.email}
                  </p>
                </div>

                {/* Shipping */}
                <div className="bg-brand-cream border border-gray-200 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium mb-3">
                    Shipping Address
                  </p>
                  <p className="font-medium text-sm mb-1">
                    {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className="text-xs text-brand-grey">
                    {selectedOrder.shippingAddress?.phone}
                  </p>
                  <p className="text-xs text-brand-grey mt-1">
                    {selectedOrder.shippingAddress?.address},{' '}
                    {selectedOrder.shippingAddress?.city}
                    {selectedOrder.shippingAddress?.postalCode &&
                      ` - ${selectedOrder.shippingAddress.postalCode}`}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium mb-3">
                  Order Items ({selectedOrder.orderItems?.length})
                </p>
                <div className="border border-gray-200 divide-y divide-gray-100">
                  {selectedOrder.orderItems?.map((item, i) => (
                    <div key={i} className="p-3 flex gap-3 items-center">
                      <div className="w-14 h-18 bg-brand-lightgrey shrink-0">
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
                          {item.color && `Color: ${item.color}`}
                          {' • '}
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm whitespace-nowrap">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium mb-3">
                    Payment
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-grey">Method</span>
                      <span className="font-medium">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-grey">Status</span>
                      <span
                        className={`font-medium ${
                          selectedOrder.isPaid
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    {selectedOrder.paidAt && (
                      <div className="flex justify-between text-xs">
                        <span className="text-brand-grey">Paid On</span>
                        <span>
                          {new Date(selectedOrder.paidAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-brand-cream border border-gray-200 p-5">
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium mb-3">
                    Order Total
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-grey">Subtotal</span>
                      <span>Rs. {selectedOrder.itemsPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-grey">Shipping</span>
                      <span>
                        {selectedOrder.shippingPrice === 0
                          ? 'FREE'
                          : `Rs. ${selectedOrder.shippingPrice?.toLocaleString()}`}
                      </span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>
                          − Rs. {selectedOrder.discountAmount?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between font-heading text-lg">
                      <span>Total</span>
                      <span>
                        Rs. {selectedOrder.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrder.statusHistory?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey font-medium mb-4">
                    Order Timeline
                  </p>
                  <div className="space-y-3">
                    {selectedOrder.statusHistory.map((h, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="relative shrink-0">
                          <span className="w-3 h-3 bg-brand-gold rounded-full mt-1 block"></span>
                          {i < selectedOrder.statusHistory.length - 1 && (
                            <span className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></span>
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-medium">{h.status}</p>
                          {h.note && (
                            <p className="text-xs text-brand-grey">{h.note}</p>
                          )}
                          <p className="text-[10px] text-brand-grey mt-1">
                            {new Date(h.date).toLocaleString('en-PK')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer — Actions */}
            <div className="p-6 border-t border-gray-200 bg-brand-cream sticky bottom-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-50">
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Update Status
                  </label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder._id, e.target.value)
                    }
                    disabled={updating}
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition bg-white cursor-pointer disabled:opacity-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {!selectedOrder.isDelivered &&
                  selectedOrder.orderStatus !== 'Cancelled' && (
                    <button
                      onClick={() => handleDeliver(selectedOrder._id)}
                      disabled={updating}
                      className="bg-green-600 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-green-700 transition disabled:opacity-50 mt-6"
                    >
                      {updating ? 'Updating...' : 'Mark as Delivered'}
                    </button>
                  )}

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 border border-gray-300 text-xs uppercase tracking-widest font-medium hover:bg-white transition mt-6"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;