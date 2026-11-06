import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { uploadImage } from '../../services/uploadService';
import toast from 'react-hot-toast';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const desktopFileRef = useRef(null);
  const mobileFileRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '', // Desktop
    mobileImage: '', // Mobile
    buttonText: 'Shop Now',
    buttonLink: '/products',
    position: 'hero',
    order: 0,
    isActive: true,
  });

  const fetchBanners = async () => {
    try {
      const { data } = await api.get('/banners/admin');
      setBanners(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      mobileImage: '',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      position: 'hero',
      order: 0,
      isActive: true,
    });
    setEditing(null);
    if (desktopFileRef.current) desktopFileRef.current.value = '';
    if (mobileFileRef.current) mobileFileRef.current.value = '';
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image || '',
      mobileImage: banner.mobileImage || '',
      buttonText: banner.buttonText || 'Shop Now',
      buttonLink: banner.buttonLink || '/products',
      position: banner.position || 'hero',
      order: banner.order || 0,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setEditing(banner);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Pakka delete karna hai?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner delete ho gaya');
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete nahi hua');
    }
  };

  // ===== Desktop image upload =====
  const handleDesktopUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: data.image }));
      toast.success('Desktop image upload ho gayi');
    } catch (error) {
      toast.error('Upload nahi hui');
    } finally {
      setUploading(false);
      if (desktopFileRef.current) desktopFileRef.current.value = '';
    }
  };

  // ===== Mobile image upload =====
  const handleMobileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await uploadImage(file);
      setFormData((prev) => ({ ...prev, mobileImage: data.image }));
      toast.success('Mobile image upload ho gayi');
    } catch (error) {
      toast.error('Upload nahi hui');
    } finally {
      setUploading(false);
      if (mobileFileRef.current) mobileFileRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Desktop image zaroori hai');
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.put(`/banners/${editing._id}`, formData);
        toast.success('Banner update ho gaya');
      } else {
        await api.post('/banners', formData);
        toast.success('Banner add ho gaya');
      }
      setShowModal(false);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save nahi hua');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Banners">
      {/* Header */}
      <div className="bg-white border border-gray-200 p-4 md:p-5 mb-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm text-brand-grey">
            <span className="font-semibold text-brand-black">
              {banners.length}
            </span>{' '}
            banners
          </p>
          <p className="text-xs text-brand-grey mt-0.5">
            Desktop aur Mobile ke liye alag images upload karein
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-brand-black text-white px-5 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
        >
          + Add Banner
        </button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="bg-white border p-12 text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white border p-16 text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <p className="font-heading text-lg mb-2">Koi banner nahi</p>
          <p className="text-sm text-brand-grey mb-6">
            Pehla banner add karein
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Desktop Preview */}
              <div className="relative aspect-video overflow-hidden bg-brand-lightgrey">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-black/70 text-white px-2 py-1">
                  Desktop
                </span>
              </div>

              {/* Mobile Preview */}
              {banner.mobileImage && (
                <div className="relative aspect-video overflow-hidden bg-brand-lightgrey border-t">
                  <img
                    src={banner.mobileImage}
                    alt="Mobile"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-brand-gold text-white px-2 py-1">
                    Mobile
                  </span>
                </div>
              )}

              <div className="p-4">
                <h3 className="font-heading text-base mb-1 line-clamp-1">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-brand-grey mb-2">
                    {banner.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[9px] uppercase tracking-widest bg-brand-cream text-brand-gold px-2 py-1">
                    {banner.position}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-widest px-2 py-1 ${
                      banner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {!banner.mobileImage && (
                    <span className="text-[9px] uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-1">
                      No Mobile Img
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 text-xs border border-gray-200 py-2 uppercase tracking-widest font-medium hover:border-brand-gold hover:text-brand-gold transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 text-xs border border-gray-200 py-2 uppercase tracking-widest font-medium hover:border-red-500 hover:text-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="font-heading text-xl">
                  {editing ? 'Edit Banner' : 'Add Banner'}
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  Desktop aur Mobile images alag rakhein
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-2xl text-brand-grey"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* ===== IMAGES ===== */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                  Banner Images
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Image */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                      Desktop Image * (1920 x 1080)
                    </label>

                    <input
                      ref={desktopFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopUpload}
                      className="hidden"
                      id="desktop-upload"
                    />

                    {formData.image ? (
                      <div className="relative aspect-video bg-brand-lightgrey overflow-hidden group">
                        <img
                          src={formData.image}
                          alt="Desktop"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <label
                            htmlFor="desktop-upload"
                            className="bg-white text-brand-black px-3 py-2 text-xs uppercase tracking-widest font-medium cursor-pointer hover:bg-brand-gold hover:text-white transition"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, image: '' })
                            }
                            className="bg-red-500 text-white px-3 py-2 text-xs uppercase tracking-widest font-medium hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="desktop-upload"
                        className={`block aspect-video border-2 border-dashed border-gray-300 hover:border-brand-gold cursor-pointer transition flex-col items-center justify-center ${
                          uploading ? 'opacity-50' : ''
                        }`}
                      >
                        {uploading ? (
                          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <div className="text-3xl mb-2">🖥️</div>
                            <p className="text-xs text-brand-grey">
                              Desktop image
                            </p>
                          </>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Mobile Image */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                      Mobile Image (800 x 1200)
                    </label>

                    <input
                      ref={mobileFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMobileUpload}
                      className="hidden"
                      id="mobile-upload"
                    />

                    {formData.mobileImage ? (
                      <div className="relative aspect-video bg-brand-lightgrey overflow-hidden group">
                        <img
                          src={formData.mobileImage}
                          alt="Mobile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <label
                            htmlFor="mobile-upload"
                            className="bg-white text-brand-black px-3 py-2 text-xs uppercase tracking-widest font-medium cursor-pointer hover:bg-brand-gold hover:text-white transition"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, mobileImage: '' })
                            }
                            className="bg-red-500 text-white px-3 py-2 text-xs uppercase tracking-widest font-medium hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="mobile-upload"
                        className={`block aspect-video border-2 border-dashed border-gray-300 hover:border-brand-gold cursor-pointer transition flex-col items-center justify-center ${
                          uploading ? 'opacity-50' : ''
                        }`}
                      >
                        {uploading ? (
                          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <div className="text-3xl mb-2">📱</div>
                            <p className="text-xs text-brand-grey">
                              Mobile image (optional)
                            </p>
                          </>
                        )}
                      </label>
                    )}
                  </div>
                </div>

                <p className="text-[10px] text-brand-grey mt-3 leading-relaxed">
                  <strong className="text-brand-black">Tip:</strong> Desktop
                  image wide (16:9), Mobile image tall (2:3). Agar mobile image
                  nahi doge to desktop image mobile par bhi use hogi.
                </p>
              </div>

              {/* ===== CONTENT ===== */}
              <div className="pt-5 border-t">
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                  Banner Content
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      placeholder="Summer Collection 2025"
                      className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="New Arrivals"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Position
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            position: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      >
                        <option value="hero">Hero (Homepage Slider)</option>
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Short description..."
                      className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            buttonText: e.target.value,
                          })
                        }
                        placeholder="Shop Now"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={formData.buttonLink}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            buttonLink: e.target.value,
                          })
                        }
                        placeholder="/products"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: Number(e.target.value),
                          })
                        }
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <label
                        className={`flex items-center gap-3 p-4 border w-full cursor-pointer transition ${
                          formData.isActive
                            ? 'border-brand-gold bg-brand-cream'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isActive: e.target.checked,
                            })
                          }
                          className="accent-brand-gold"
                        />
                        <div>
                          <p className="text-sm font-medium">Active</p>
                          <p className="text-[10px] text-brand-grey">
                            Website par show
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-5 border-t">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 bg-brand-black text-white py-3.5 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-8 border text-xs uppercase tracking-widest font-medium hover:bg-brand-cream transition"
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

export default AdminBanners;