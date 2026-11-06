import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    expiryDate: '',
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: 0,
      maxDiscount: 0,
      usageLimit: 0,
      expiryDate: '',
      isActive: true,
    });
    setEditing(null);
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      expiryDate: coupon.expiryDate?.slice(0, 10) || '',
      isActive: coupon.isActive,
    });
    setEditing(coupon);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Pakka delete karna hai?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Delete nahi hua');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/coupons/${editing._id}`, formData);
      } else {
        await api.post('/coupons', formData);
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Save nahi hua');
    } finally {
      setSaving(false);
    }
  };

  const isExpired = (date) => new Date(date) < new Date();
  const isExhausted = (coupon) =>
    coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit;

  const getCouponStatus = (coupon) => {
    if (!coupon.isActive) return { label: 'Inactive', color: 'bg-gray-100 text-gray-600 border-gray-300' };
    if (isExpired(coupon.expiryDate)) return { label: 'Expired', color: 'bg-red-50 text-red-700 border-red-200' };
    if (isExhausted(coupon)) return { label: 'Used Up', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { label: 'Active', color: 'bg-green-50 text-green-700 border-green-200' };
  };

  const filteredCoupons = coupons.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.code?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter(
      (c) => c.isActive && !isExpired(c.expiryDate) && !isExhausted(c)
    ).length,
    expired: coupons.filter((c) => isExpired(c.expiryDate)).length,
    totalUsed: coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0),
  };

  return (
    <AdminLayout title="Coupons">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Coupons', value: stats.total, color: 'text-brand-black', bg: 'bg-white' },
          { label: 'Active', value: stats.active, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Expired', value: stats.expired, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Used', value: stats.totalUsed, color: 'text-brand-gold', bg: 'bg-brand-cream' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border border-gray-200 p-4`}>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-grey mb-1">
              {s.label}
            </p>
            <p className={`font-heading text-2xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 p-4 md:p-5 mb-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search coupons..."
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-brand-black text-white px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-medium hover:bg-brand-gold transition flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Coupon
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-brand-grey">Loading coupons...</p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <div className="inline-flex w-16 h-16 border border-gray-200 rounded-full items-center justify-center mb-4">
            <svg className="w-7 h-7 text-brand-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <p className="font-heading text-lg mb-2">Koi coupon nahi hai</p>
          <p className="text-sm text-brand-grey mb-4">
            {search ? 'Search term change karein' : 'Pehla coupon add karein'}
          </p>
          {!search && (
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-block bg-brand-black text-white px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
            >
              Add First Coupon
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream border-b border-gray-200">
                <tr className="text-left text-[10px] uppercase tracking-widest text-brand-grey">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Discount</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Min Order</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Usage</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Expiry</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCoupons.map((coupon) => {
                  const status = getCouponStatus(coupon);
                  return (
                    <tr key={coupon._id} className="hover:bg-brand-cream/50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-cream flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-heading font-bold text-base tracking-wider">
                              {coupon.code}
                            </p>
                            {coupon.description && (
                              <p className="text-xs text-brand-grey line-clamp-1 max-w-50">
                                {coupon.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-semibold text-brand-black">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `Rs. ${coupon.discountValue}`}
                        </span>
                        {coupon.maxDiscount > 0 && coupon.discountType === 'percentage' && (
                          <p className="text-[10px] text-brand-grey">
                            Max: Rs. {coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 hidden md:table-cell text-sm">
                        {coupon.minOrderAmount > 0
                          ? `Rs. ${coupon.minOrderAmount.toLocaleString()}`
                          : '—'}
                      </td>

                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 max-w-20 overflow-hidden">
                            <div
                              className="h-full bg-brand-gold"
                              style={{
                                width:
                                  coupon.usageLimit > 0
                                    ? `${Math.min(
                                        (coupon.usedCount / coupon.usageLimit) * 100,
                                        100
                                      )}%`
                                    : '0%',
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-brand-grey whitespace-nowrap">
                            {coupon.usedCount}
                            {coupon.usageLimit > 0 && `/${coupon.usageLimit}`}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 hidden md:table-cell text-xs">
                        <span className={isExpired(coupon.expiryDate) ? 'text-red-600' : ''}>
                          {new Date(coupon.expiryDate).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 border ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(coupon)}
                            className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition"
                            aria-label="Edit"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
                            aria-label="Delete"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="font-heading text-xl">
                  {editing ? 'Edit Coupon' : 'Add New Coupon'}
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  {editing ? `Editing: ${editing.code}` : 'Discount code banayein'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="w-8 h-8 flex items-center justify-center text-brand-grey hover:text-brand-black hover:bg-brand-cream transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase().replace(/\s/g, ''),
                      })
                    }
                    required
                    placeholder="SAVE10"
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition font-heading tracking-widest font-bold"
                  />
                  <p className="text-[10px] text-brand-grey mt-1">
                    Uppercase, no spaces (e.g. EID25, SAVE10)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Eid special 25% off on orders above Rs. 3000"
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs.)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: e.target.value })
                    }
                    required
                    min="1"
                    placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Min Order Amount
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: Number(e.target.value),
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                  <p className="text-[10px] text-brand-grey mt-1">0 = no minimum</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Max Discount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscount: Number(e.target.value),
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                  <p className="text-[10px] text-brand-grey mt-1">
                    0 = no limit (only for %)
                  </p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: Number(e.target.value),
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                  <p className="text-[10px] text-brand-grey mt-1">0 = unlimited</p>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition ${
                      formData.isActive
                        ? 'border-brand-gold bg-brand-cream'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="accent-brand-gold mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium">Active</p>
                      <p className="text-xs text-brand-grey mt-0.5">
                        Customers ye coupon use kar sakte hain
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-5 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>{editing ? 'Update Coupon' : 'Create Coupon'}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-8 border border-gray-300 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-cream transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCoupons;