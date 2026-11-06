import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, stockRes, topRes, chartRes] =
          await Promise.all([
            api.get('/dashboard/stats'),
            api.get('/dashboard/recent-orders'),
            api.get('/dashboard/low-stock'),
            api.get('/dashboard/top-products'),
            api.get('/dashboard/sales-chart'),
          ]);

        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
        setLowStock(stockRes.data);
        setTopProducts(topRes.data);
        setSalesChart(chartRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // ===== Loading =====
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-brand-lightgrey animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-brand-lightgrey animate-pulse"></div>
          <div className="h-80 bg-brand-lightgrey animate-pulse"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Sales',
      value: `Rs. ${(stats?.totalSales || 0).toLocaleString()}`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600',
      bg: 'bg-green-50',
      link: '/admin/orders',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      subtext: `${stats?.pendingOrders || 0} pending`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/admin/orders',
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/admin/users',
    },
    {
      label: 'Products',
      value: stats?.totalProducts || 0,
      subtext: `${lowStock.length} low stock`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'text-brand-gold',
      bg: 'bg-brand-cream',
      link: '/admin/products',
    },
  ];

  // Max value for chart
  const maxSales = Math.max(...salesChart.map((d) => d.sales), 1);

  return (
    <div className="space-y-6">
      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="group bg-white border border-gray-200 p-5 hover:border-brand-gold hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${card.bg} ${card.color} flex items-center justify-center`}>
                {card.icon}
              </div>
              <svg
                className="w-4 h-4 text-gray-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey mb-1">
              {card.label}
            </p>
            <p className="font-heading text-xl md:text-2xl text-brand-black truncate">
              {card.value}
            </p>
            {card.subtext && (
              <p className="text-xs text-brand-grey mt-1">{card.subtext}</p>
            )}
          </Link>
        ))}
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg">Quick Actions</h2>
            <p className="text-xs text-brand-grey mt-0.5">
              Common tasks for daily management
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Product', link: '/admin/products', icon: '📦' },
            { label: 'Manage Orders', link: '/admin/orders', icon: '🛒' },
            { label: 'Add Banner', link: '/admin/banners', icon: '🖼️' },
            { label: 'New Coupon', link: '/admin/coupons', icon: '🎟️' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="flex items-center gap-3 p-4 border border-gray-200 hover:border-brand-gold hover:bg-brand-cream transition-all duration-300 group"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs uppercase tracking-widest font-medium group-hover:text-brand-gold transition">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== Two Column Layout ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-lg">Sales — Last 7 Days</h2>
              <p className="text-xs text-brand-grey mt-0.5">
                Daily revenue overview
              </p>
            </div>
            <span className="text-xs text-brand-grey uppercase tracking-widest">
              {salesChart.length} days
            </span>
          </div>

          {salesChart.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-brand-grey">Abhi tak koi sales nahi</p>
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
              {salesChart.map((day, i) => {
                const height = maxSales > 0 ? (day.sales / maxSales) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-8 bg-brand-black text-white text-xs px-2 py-1 whitespace-nowrap">
                      Rs. {day.sales.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div className="w-full relative h-48 flex items-end">
                      <div
                        className="w-full bg-brand-gold/80 hover:bg-brand-gold transition-all duration-500 group-hover:bg-brand-black"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <p className="text-[10px] text-brand-grey">
                        {new Date(day._id).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-[10px] font-medium text-brand-black">
                        {day.orders}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="font-heading text-lg">Top Products</h2>
            <p className="text-xs text-brand-grey mt-0.5">
              Best sellers
            </p>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-sm text-brand-grey text-center py-8">
              Abhi tak koi sale nahi
            </p>
          ) : (
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, i) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-brand-cream flex items-center justify-center text-xs font-bold text-brand-gold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-brand-grey">
                      {product.totalSold} sold
                    </p>
                  </div>
                  <p className="text-xs font-medium text-brand-black whitespace-nowrap">
                    Rs. {product.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Recent Orders ===== */}
      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg">Recent Orders</h2>
            <p className="text-xs text-brand-grey mt-0.5">
              Latest 10 orders
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs uppercase tracking-widest text-brand-gold hover:underline"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-brand-grey text-center py-12">
            Koi order nahi mila
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream">
                <tr className="text-left text-[10px] uppercase tracking-widest text-brand-grey">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-brand-cream/50 transition">
                    <td className="px-6 py-4 font-medium text-xs">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">
                        {order.user?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-brand-grey">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      Rs. {order.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${
                          order.isPaid
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <p className="text-[10px] text-brand-grey mt-1">
                        {order.paymentMethod}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${statusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-grey whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-xs text-brand-gold hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Low Stock Alert ===== */}
      {lowStock.length > 0 && (
        <div className="bg-white border border-red-200 overflow-hidden">
          <div className="p-6 border-b border-red-100 bg-red-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-lg text-red-700">
                  Low Stock Alert
                </h2>
                <p className="text-xs text-red-600 mt-0.5">
                  {lowStock.length} products ka stock kam hai
                </p>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="text-xs uppercase tracking-widest text-red-600 hover:underline"
            >
              Manage →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {lowStock.slice(0, 5).map((product) => (
              <div
                key={product._id}
                className="p-4 flex items-center gap-4 hover:bg-brand-cream/50 transition"
              >
                <div className="w-12 h-16 bg-brand-lightgrey shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-brand-grey">
                    Rs. {product.price?.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${product.stock < 5 ? 'text-red-600' : 'text-orange-500'}`}>
                    {product.stock}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey">
                    left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;