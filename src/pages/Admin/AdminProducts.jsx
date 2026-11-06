import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { uploadImage } from '../../services/uploadService';
import CategorySelect from '../../components/CategorySelect';   // ← NEW
import toast from 'react-hot-toast';

// ============================================================
// EMPTY FORM TEMPLATE (ek hi jagah define — DRY)
// ============================================================
const EMPTY_FORM = {
  name: '',
  shortDescription: '',
  description: '',
  details: '',
  careInstructions: '',
  brand: 'Roshys',
  price: '',
  discountPrice: '',
  discountPercent: '',
  category: '',
  images: [],
  colorImages: [],
  sizes: '',
  colors: '',
  fabric: '',
  stock: '',
  sku: '',
  isFeatured: false,
  isNewArrival: false,
  isOnSale: false,
};

// ============================================================
// Helper — flat categories → nested tree
// ============================================================
const buildTree = (flat) => {
  if (!Array.isArray(flat) || flat.length === 0) return [];
  // Already nested? children present?
  if (flat.some((c) => Array.isArray(c.children))) return flat;

  const map = {};
  const roots = [];
  flat.forEach((c) => {
    map[c._id] = { ...c, children: [] };
  });
  flat.forEach((c) => {
    const parentId = c.parentCategory?._id || c.parentCategory;
    if (parentId && map[parentId] && parentId !== c._id) {
      map[parentId].children.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });
  return roots;
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Image mode: 'simple' | 'color'
  const [imageMode, setImageMode] = useState('simple');

  const simpleFileRef = useRef(null);
  const colorFileRef = useRef(null);
  const [activeColorForUpload, setActiveColorForUpload] = useState('');

  // ===== Reviews management (inside edit modal) =====
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewActionId, setReviewActionId] = useState(null);
  const [reviewTab, setReviewTab] = useState('details');

  const [formData, setFormData] = useState(EMPTY_FORM);

  // ============================================================
  // FETCH
  // ============================================================
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?pageSize=200');
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      toast.error('Products load nahi hue');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Try navbar endpoint first (nested), fallback to /categories
      let data;
      try {
        const res = await api.get('/categories/navbar');
        data = res.data;
      } catch {
        const res = await api.get('/categories');
        data = res.data;
      }
      setCategories(buildTree(data));
    } catch (error) {
      console.error(error);
      toast.error('Categories load nahi hui');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ============================================================
  // RESET / EDIT
  // ============================================================
  const resetForm = () => {
    setFormData({ ...EMPTY_FORM });
    setEditing(null);
    setImageMode('simple');
    setProductReviews([]);
    setReviewTab('details');
    setReviewActionId(null);
    if (simpleFileRef.current) simpleFileRef.current.value = '';
    if (colorFileRef.current) colorFileRef.current.value = '';
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      details: product.details || '',
      careInstructions: product.careInstructions || '',
      brand: product.brand || 'Roshys',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      discountPercent: product.discountPercent ?? '',
      category: product.category?._id || '',
      images: product.images || [],
      colorImages: product.colorImages || [],
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
      fabric: product.fabric || '',
      stock: product.stock ?? '',
      sku: product.sku || '',
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isOnSale: product.isOnSale || false,
    });
    setImageMode(product.colorImages?.length > 0 ? 'color' : 'simple');
    setEditing(product);
    setShowModal(true);
    setReviewTab('details');
    fetchProductReviews(product._id);
  };

  // ============================================================
  // REVIEWS
  // ============================================================
  const fetchProductReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get(
        `/products/admin/products/${productId}/reviews`
      );
      setProductReviews(data || []);
    } catch (err) {
      console.error(err);
      const prod = products.find((p) => p._id === productId);
      setProductReviews(prod?.reviews || []);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewStatus = async (reviewId, status) => {
    if (reviewActionId) return;
    setReviewActionId(reviewId);
    try {
      await api.put(
        `/products/admin/products/${editing._id}/reviews/${reviewId}`,
        { status }
      );
      setProductReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, status } : r))
      );
      toast.success(`Review ${status} ho gaya`);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Status update fail');
    } finally {
      setReviewActionId(null);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Review delete karein?')) return;
    if (reviewActionId) return;
    setReviewActionId(reviewId);
    try {
      await api.delete(
        `/products/admin/products/${editing._id}/reviews/${reviewId}`
      );
      setProductReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success('Review delete ho gaya');
      fetchProducts();
    } catch (error) {
      toast.error('Review delete fail');
    } finally {
      setReviewActionId(null);
    }
  };

  // ============================================================
  // PRODUCT DELETE
  // ============================================================
  const handleDelete = async (id) => {
    if (!window.confirm('Pakka delete karna hai?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product delete ho gaya');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete nahi hua');
    }
  };

  // ============================================================
  // IMAGE UPLOADS
  // ============================================================
  const handleSimpleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = await uploadImage(file);
        if (data?.image) uploadedUrls.push(data.image);
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      toast.success(`${uploadedUrls.length} image upload ho gayi`);
    } catch (error) {
      toast.error('Image upload nahi hui');
    } finally {
      setUploading(false);
      if (simpleFileRef.current) simpleFileRef.current.value = '';
    }
  };

  const handleRemoveSimpleImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleColorUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !activeColorForUpload) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = await uploadImage(file);
        if (data?.image) uploadedUrls.push(data.image);
      }

      setFormData((prev) => {
        const existing = prev.colorImages.find(
          (ci) => ci.color === activeColorForUpload
        );
        if (existing) {
          return {
            ...prev,
            colorImages: prev.colorImages.map((ci) =>
              ci.color === activeColorForUpload
                ? { ...ci, images: [...ci.images, ...uploadedUrls] }
                : ci
            ),
          };
        }
        return {
          ...prev,
          colorImages: [
            ...prev.colorImages,
            { color: activeColorForUpload, images: uploadedUrls },
          ],
        };
      });

      toast.success(
        `${uploadedUrls.length} image add ho gayi (${activeColorForUpload})`
      );
    } catch (error) {
      toast.error('Image upload nahi hui');
    } finally {
      setUploading(false);
      setActiveColorForUpload('');
      if (colorFileRef.current) colorFileRef.current.value = '';
    }
  };

  const handleRemoveColorImage = (color, index) => {
    setFormData((prev) => ({
      ...prev,
      colorImages: prev.colorImages
        .map((ci) =>
          ci.color === color
            ? { ...ci, images: ci.images.filter((_, i) => i !== index) }
            : ci
        )
        .filter((ci) => ci.images.length > 0),
    }));
  };

  const triggerColorUpload = (color) => {
    setActiveColorForUpload(color);
    setTimeout(() => colorFileRef.current?.click(), 50);
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasImages =
      formData.images.length > 0 ||
      formData.colorImages.some((ci) => ci.images.length > 0);
    if (!hasImages) {
      toast.error('Kam se kam ek image upload karein');
      return;
    }

    setSaving(true);

    let discountPercent = Number(formData.discountPercent) || 0;
    if (formData.price && formData.discountPrice && !discountPercent) {
      const price = Number(formData.price);
      const discountPrice = Number(formData.discountPrice);
      if (discountPrice > 0 && discountPrice < price) {
        discountPercent = Math.round(((price - discountPrice) / price) * 100);
      }
    }

    const mainImage =
      formData.colorImages[0]?.images[0] || formData.images[0] || '';

    const payload = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      description: formData.description,
      details: formData.details,
      careInstructions: formData.careInstructions,
      brand: formData.brand || 'Roshys',
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      discountPercent,
      category: formData.category,
      images:
        formData.images.length > 0
          ? formData.images
          : mainImage
          ? [mainImage]
          : [],
      colorImages: formData.colorImages,
      sizes: formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      colors: formData.colors
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      fabric: formData.fabric,
      stock: Number(formData.stock),
      sku: formData.sku,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isOnSale: formData.isOnSale,
    };

    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        toast.success('Product update ho gaya');
      } else {
        await api.post('/products', payload);
        toast.success('Product add ho gaya');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      const apiErr = error.response?.data;
      if (apiErr?.errors?.length) {
        toast.error(apiErr.errors[0].message);
      } else {
        toast.error(apiErr?.message || 'Save nahi hua');
      }
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DERIVED
  // ============================================================
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const colorList = formData.colors
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  const pendingReviewsCount = productReviews.filter(
    (r) => r.status === 'pending'
  ).length;

  return (
    <AdminLayout title="Products">
      {/* ===== HEADER ===== */}
      <div className="bg-white border border-gray-200 p-4 md:p-5 mb-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-4 flex-1">
          <p className="text-sm text-brand-grey whitespace-nowrap">
            <span className="font-semibold text-brand-black">
              {products.length}
            </span>{' '}
            products
          </p>
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
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

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-brand-black text-white px-5 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition flex items-center gap-2 self-start md:self-auto"
        >
          + Add Product
        </button>
      </div>

      {/* ===== TABLE ===== */}
      {loading ? (
        <div className="bg-white border p-12 text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border p-16 text-center">
          <p className="font-heading text-lg mb-2">Koi product nahi mila</p>
          <p className="text-sm text-brand-grey">
            {search
              ? 'Search clear karke dobara try karo'
              : 'Pehla product add karne ke liye "+ Add Product" dabao'}
          </p>
        </div>
      ) : (
        <div className="bg-white border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream border-b">
                <tr className="text-left text-[10px] uppercase tracking-widest text-brand-grey">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">
                    Reviews
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const pendingCount =
                    product.reviews?.filter((r) => r.status === 'pending')
                      .length || 0;
                  const thumb =
                    product.colorImages?.[0]?.images?.[0] ||
                    product.images?.[0] ||
                    '';
                  const rating = Number(product.rating) || 0;
                  const numReviews = Number(product.numReviews) || 0;
                  return (
                    <tr key={product._id} className="hover:bg-brand-cream/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 bg-brand-lightgrey flex-shrink-0 overflow-hidden">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-brand-grey">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[200px]">
                              {product.name}
                            </p>
                            {product.sku && (
                              <p className="text-xs text-brand-grey">
                                SKU: {product.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-xs text-brand-grey">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        {product.discountPrice > 0 ? (
                          <div>
                            <p className="font-medium">
                              Rs.{' '}
                              {Number(product.discountPrice).toLocaleString()}
                            </p>
                            <p className="text-xs text-brand-grey line-through">
                              Rs. {Number(product.price).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="font-medium">
                            Rs. {Number(product.price).toLocaleString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? 'text-red-600'
                              : product.stock < 10
                              ? 'text-orange-500'
                              : 'text-brand-black'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 items-center">
                          {numReviews > 0 ? (
                            <span className="text-[10px] text-brand-grey">
                              ⭐ {rating.toFixed(1)} ({numReviews})
                            </span>
                          ) : (
                            <span className="text-[10px] text-brand-grey">
                              No reviews
                            </span>
                          )}
                          {pendingCount > 0 && (
                            <span className="text-[9px] uppercase tracking-widest bg-yellow-500 text-white px-1.5 py-0.5">
                              {pendingCount} pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition"
                            title="Edit"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="w-8 h-8 border border-gray-200 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <svg
                              className="w-3.5 h-3.5"
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

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full my-8 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="font-heading text-xl">
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  {editing ? `Editing: ${editing.name}` : 'Fill details below'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-brand-grey hover:text-brand-black hover:bg-brand-cream transition"
              >
                ✕
              </button>
            </div>

            {/* Tab switch — sirf edit mode */}
            {editing && (
              <div className="flex border-b border-gray-200 px-6">
                <button
                  type="button"
                  onClick={() => setReviewTab('details')}
                  className={`py-3 text-xs uppercase tracking-widest font-medium border-b-2 transition ${
                    reviewTab === 'details'
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-brand-grey hover:text-brand-black'
                  }`}
                >
                  Product Details
                </button>
                <button
                  type="button"
                  onClick={() => setReviewTab('reviews')}
                  className={`py-3 ml-6 text-xs uppercase tracking-widest font-medium border-b-2 transition flex items-center gap-2 ${
                    reviewTab === 'reviews'
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-brand-grey hover:text-brand-black'
                  }`}
                >
                  Reviews ({productReviews.length})
                  {pendingReviewsCount > 0 && (
                    <span className="bg-yellow-500 text-white text-[9px] px-1.5 py-0.5">
                      {pendingReviewsCount} new
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* ===== REVIEWS TAB CONTENT ===== */}
            {editing && reviewTab === 'reviews' ? (
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {reviewsLoading ? (
                  <div className="text-center py-10">
                    <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : productReviews.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-300">
                    <p className="text-sm text-brand-grey">
                      Is product pe abhi koi review nahi hai.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productReviews.map((review) => {
                      const isProcessing = reviewActionId === review._id;
                      return (
                        <div
                          key={review._id}
                          className={`border border-gray-200 p-4 ${
                            isProcessing ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-sm">
                                {review.name}
                                {review.isVerifiedPurchase && (
                                  <span className="ml-2 text-[9px] uppercase tracking-widest bg-green-100 text-green-700 px-1.5 py-0.5">
                                    ✓ Verified
                                  </span>
                                )}
                              </p>
                              <div className="flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-xs ${
                                      i < review.rating
                                        ? 'text-brand-gold'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <p className="text-[10px] text-brand-grey mt-1">
                                {new Date(review.createdAt).toLocaleDateString(
                                  'en-PK',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                            </div>
                            <span
                              className={`text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                                review.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : review.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {review.status || 'pending'}
                            </span>
                          </div>
                          <p className="text-sm text-brand-grey mb-3">
                            {review.comment}
                          </p>
                          {review.images?.length > 0 && (
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {review.images.map((img, i) => (
                                <a
                                  key={i}
                                  href={img}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block"
                                >
                                  <img
                                    src={img}
                                    className="w-14 h-14 object-cover border hover:opacity-80 transition"
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {review.status !== 'approved' && (
                              <button
                                onClick={() =>
                                  handleReviewStatus(review._id, 'approved')
                                }
                                disabled={isProcessing}
                                className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                {isProcessing ? '...' : 'Approve'}
                              </button>
                            )}
                            {review.status !== 'rejected' && (
                              <button
                                onClick={() =>
                                  handleReviewStatus(review._id, 'rejected')
                                }
                                disabled={isProcessing}
                                className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                              >
                                {isProcessing ? '...' : 'Reject'}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={isProcessing}
                              className="text-[10px] uppercase tracking-widest px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            >
                              {isProcessing ? '...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* ===== PRODUCT FORM ===== */
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* IMAGE MODE */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-3">
                    Image Type
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setImageMode('simple')}
                      className={`p-4 border text-left transition ${
                        imageMode === 'simple'
                          ? 'border-brand-gold bg-brand-cream'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm mb-1">Simple Images</p>
                      <p className="text-xs text-brand-grey">
                        Sab colors ke liye same images
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageMode('color')}
                      className={`p-4 border text-left transition ${
                        imageMode === 'color'
                          ? 'border-brand-gold bg-brand-cream'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm mb-1">
                        Color-Based Images
                      </p>
                      <p className="text-xs text-brand-grey">
                        Har color ki alag images
                      </p>
                    </button>
                  </div>

                  {/* SIMPLE MODE */}
                  {imageMode === 'simple' && (
                    <div>
                      <input
                        ref={simpleFileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleSimpleUpload}
                        className="hidden"
                        id="simple-upload"
                      />

                      <label
                        htmlFor="simple-upload"
                        className={`block border-2 border-dashed border-gray-300 hover:border-brand-gold p-6 text-center cursor-pointer transition ${
                          uploading ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-brand-grey">
                              Uploading...
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="text-3xl mb-2">📷</div>
                            <p className="text-sm font-medium text-brand-black">
                              Image upload karein
                            </p>
                            <p className="text-xs text-brand-grey mt-1">
                              Multiple images ek saath select karein
                            </p>
                          </>
                        )}
                      </label>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                          {formData.images.map((img, i) => (
                            <div
                              key={i}
                              className="relative aspect-[3/4] bg-brand-lightgrey overflow-hidden group"
                            >
                              <img
                                src={img}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {i === 0 && (
                                <span className="absolute top-1 left-1 bg-brand-gold text-white text-[8px] uppercase tracking-widest px-1.5 py-0.5">
                                  Main
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveSimpleImage(i)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COLOR MODE */}
                  {imageMode === 'color' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                          Colors (comma separated) — pehle ye bharein *
                        </label>
                        <input
                          type="text"
                          value={formData.colors}
                          onChange={(e) =>
                            setFormData({ ...formData, colors: e.target.value })
                          }
                          placeholder="Red, Blue, Green"
                          className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                        />
                        <p className="text-[10px] text-brand-grey mt-1">
                          Jaise: Red, Blue — phir har color ki images add karein
                        </p>
                      </div>

                      <input
                        ref={colorFileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleColorUpload}
                        className="hidden"
                      />

                      {colorList.length === 0 ? (
                        <div className="p-6 bg-brand-cream text-center border border-dashed border-gray-300">
                          <p className="text-sm text-brand-grey">
                            Pehle colors likhein (jaise: Red, Blue)
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {colorList.map((color) => {
                            const colorData = formData.colorImages.find(
                              (ci) => ci.color === color
                            );
                            return (
                              <div
                                key={color}
                                className="border border-gray-200 p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <p className="font-medium text-sm">
                                    {color} —{' '}
                                    <span className="text-brand-grey">
                                      {colorData?.images.length || 0} images
                                    </span>
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => triggerColorUpload(color)}
                                    disabled={uploading}
                                    className="bg-brand-black text-white px-4 py-1.5 text-[10px] uppercase tracking-widest font-medium hover:bg-brand-gold transition disabled:opacity-50"
                                  >
                                    + Add Images
                                  </button>
                                </div>

                                {colorData?.images.length > 0 && (
                                  <div className="grid grid-cols-4 gap-2">
                                    {colorData.images.map((img, i) => (
                                      <div
                                        key={i}
                                        className="relative aspect-[3/4] bg-brand-lightgrey overflow-hidden group"
                                      >
                                        <img
                                          src={img}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveColorImage(color, i)
                                          }
                                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* BASIC INFO */}
                <div className="pt-5 border-t border-gray-200">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Basic Information
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        placeholder="e.g. Embroidered Lawn Suit"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Short Description{' '}
                        <span className="text-brand-grey normal-case tracking-normal">
                          (optional — product page pe top)
                        </span>
                      </label>
                      <textarea
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shortDescription: e.target.value,
                          })
                        }
                        rows={2}
                        maxLength={300}
                        placeholder="1-2 line ka hook likhein..."
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none resize-none"
                      />
                      <p className="text-[10px] text-brand-grey mt-1">
                        {formData.shortDescription.length}/300 characters
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Full Description *{' '}
                        <span className="text-brand-grey normal-case tracking-normal">
                          (Description tab mein)
                        </span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                        rows={5}
                        placeholder="Product ki poori detail: design, fit, occasion, styling tips..."
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Details{' '}
                        <span className="text-brand-grey normal-case tracking-normal">
                          (Details tab — har line ek bullet)
                        </span>
                      </label>
                      <textarea
                        value={formData.details}
                        onChange={(e) =>
                          setFormData({ ...formData, details: e.target.value })
                        }
                        rows={4}
                        placeholder={`Example:\n3-piece unstitched suit\nEmbroidered front\nPrinted dupatta\nLawn fabric`}
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none resize-y font-mono text-xs"
                      />
                      <p className="text-[10px] text-brand-grey mt-1">
                        Har line alag bullet point banegi
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Care Instructions{' '}
                        <span className="text-brand-grey normal-case tracking-normal">
                          (Care tab mein)
                        </span>
                      </label>
                      <textarea
                        value={formData.careInstructions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            careInstructions: e.target.value,
                          })
                        }
                        rows={2}
                        placeholder={`Dry clean only\nIron on low heat\nDo not bleach`}
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none resize-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* PRICING */}
                <div className="pt-5 border-t border-gray-200">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Pricing & Stock
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        required
                        min="0"
                        placeholder="4500"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Discount Price
                      </label>
                      <input
                        type="number"
                        value={formData.discountPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPrice: e.target.value,
                          })
                        }
                        min="0"
                        placeholder="3500"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Discount %
                      </label>
                      <input
                        type="number"
                        value={formData.discountPercent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPercent: e.target.value,
                          })
                        }
                        min="0"
                        max="100"
                        placeholder="Auto"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        required
                        min="0"
                        placeholder="50"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="pt-5 border-t border-gray-200">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Category & Details
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Category *
                      </label>
                      <CategorySelect
                        categories={categories}
                        value={formData.category}
                        onChange={(catId) =>
                          setFormData({ ...formData, category: catId })
                        }
                      />
                      {/* Hidden input for native form validation */}
                      <input
                        type="text"
                        value={formData.category}
                        required
                        readOnly
                        className="sr-only"
                        tabIndex={-1}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        placeholder="Roshys"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        placeholder="W-001"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Fabric
                      </label>
                      <input
                        type="text"
                        value={formData.fabric}
                        onChange={(e) =>
                          setFormData({ ...formData, fabric: e.target.value })
                        }
                        placeholder="Lawn, Cotton, Chiffon..."
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-brand-grey font-medium block mb-2">
                        Sizes (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) =>
                          setFormData({ ...formData, sizes: e.target.value })
                        }
                        placeholder="S, M, L, XL"
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* FLAGS */}
                <div className="pt-5 border-t border-gray-200">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-medium mb-4">
                    Display Settings
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {
                        key: 'isFeatured',
                        label: 'Featured Product',
                        desc: 'Homepage par show',
                      },
                      {
                        key: 'isNewArrival',
                        label: 'New Arrival',
                        desc: 'New badge dikhaye',
                      },
                      {
                        key: 'isOnSale',
                        label: 'On Sale',
                        desc: 'Sale badge',
                      },
                    ].map((flag) => (
                      <label
                        key={flag.key}
                        className={`flex items-start gap-3 p-4 border cursor-pointer transition ${
                          formData[flag.key]
                            ? 'border-brand-gold bg-brand-cream'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData[flag.key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [flag.key]: e.target.checked,
                            })
                          }
                          className="accent-brand-gold mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-medium">{flag.label}</p>
                          <p className="text-xs text-brand-grey mt-0.5">
                            {flag.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex gap-3 pt-5 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 bg-brand-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>{editing ? 'Update Product' : 'Create Product'}</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-8 border border-gray-300 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-cream transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;