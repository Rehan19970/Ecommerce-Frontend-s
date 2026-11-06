import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // Navigation — breadcrumb trail
  // [] = top level | [catId] = inside cat | [catId, subId] = inside sub
  const [navStack, setNavStack] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentCategory: '',
    showInNavbar: true,
    menuOrder: 0,
    highlight: false,
    highlightColor: 'gold',
    isActive: true,
  });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setAllCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      parentCategory: '',
      showInNavbar: true,
      menuOrder: 0,
      highlight: false,
      highlightColor: 'gold',
      isActive: true,
    });
    setEditing(null);
  };

  // ===== Current parent =====
  const currentParentId = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  const currentCategories = allCategories
    .filter((cat) => {
      const catParent = cat.parentCategory?._id || null;
      return catParent === currentParentId;
    })
    .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0));

  // Breadcrumb names
  const breadcrumb = navStack
    .map((id) => {
      const cat = allCategories.find((c) => c._id === id);
      return cat ? cat.name : '';
    })
    .filter(Boolean);

  // ===== Navigation =====
  const goInside = (catId) => {
    setNavStack([...navStack, catId]);
  };

  const goBack = () => {
    setNavStack(navStack.slice(0, -1));
  };

  const goToLevel = (index) => {
    setNavStack(navStack.slice(0, index + 1));
  };

  const goHome = () => {
    setNavStack([]);
  };

  // ===== Add category =====
  const openAddModal = () => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      parentCategory: currentParentId || '',
      menuOrder: currentCategories.length + 1,
    }));
    setShowModal(true);
  };

  // ===== Edit category =====
  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      parentCategory: cat.parentCategory?._id || '',
      showInNavbar: cat.showInNavbar !== undefined ? cat.showInNavbar : true,
      menuOrder: cat.menuOrder || 0,
      highlight: cat.highlight || false,
      highlightColor: cat.highlightColor || 'gold',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setEditing(cat);
    setShowModal(true);
  };

  // ===== Delete =====
  const handleDelete = async (cat) => {
    const childCount = allCategories.filter(
      (c) => c.parentCategory?._id === cat._id
    ).length;

    const message =
      childCount > 0
        ? `"${cat.name}" delete karein?\n\n⚠️ Iske andar ${childCount} sub-category hain — wo bhi delete ho jayengi.`
        : `"${cat.name}" delete karein?`;

    if (!window.confirm(message)) return;

    try {
      await api.delete(`/categories/${cat._id}`);
      toast.success('Delete ho gaya');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete nahi hua');
    }
  };

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      parentCategory: formData.parentCategory || null,
    };

    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, payload);
        toast.success('Update ho gaya');
      } else {
        await api.post('/categories', payload);
        toast.success('Category add ho gayi');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Save nahi nahi hua');
    } finally {
      setSaving(false);
    }
  };

  // Total sub-categories count
  const getSubCount = (catId) =>
    allCategories.filter((c) => c.parentCategory?._id === catId).length;

  return (
    <AdminLayout title="Categories">
      {/* ===== Breadcrumb / Back Button ===== */}
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        {navStack.length > 0 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-brand-gold text-sm font-medium transition"
          >
            <span>←</span>
            Back
          </button>
        )}

        <div className="flex items-center gap-2 text-sm flex-wrap">
          <button
            onClick={goHome}
            className={`font-medium transition ${
              navStack.length === 0
                ? 'text-brand-black'
                : 'text-brand-grey hover:text-brand-gold'
            }`}
          >
            All Categories
          </button>
          {breadcrumb.map((name, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-brand-grey">›</span>
              <button
                onClick={() => goToLevel(i)}
                className={`font-medium transition ${
                  i === breadcrumb.length - 1
                    ? 'text-brand-black'
                    : 'text-brand-grey hover:text-brand-gold'
                }`}
              >
                {name}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ===== Header ===== */}
      <div className="bg-white border border-gray-200 p-5 mb-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="font-heading text-lg">
            {navStack.length === 0 ? 'All Categories' : breadcrumb[breadcrumb.length - 1]}
          </p>
          <p className="text-xs text-brand-grey mt-0.5">
            {currentCategories.length} item{currentCategories.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-brand-black text-white px-5 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
        >
          + Add {navStack.length === 0 ? 'Category' : 'Sub-category'}
        </button>
      </div>

      {/* ===== Categories List ===== */}
      {loading ? (
        <div className="bg-white border p-12 text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : currentCategories.length === 0 ? (
        <div className="bg-white border border-gray-200 p-16 text-center">
          <div className="text-5xl mb-4">📁</div>
          <p className="font-heading text-lg mb-2">Koi category nahi</p>
          <p className="text-sm text-brand-grey mb-6">
            {navStack.length === 0
              ? 'Pehli category add karein'
              : 'Iske andar koi sub-category nahi'}
          </p>
          <button
            onClick={openAddModal}
            className="inline-block bg-brand-black text-white px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
          >
            + Add {navStack.length === 0 ? 'Category' : 'Sub-category'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {currentCategories.map((cat) => {
            const subCount = getSubCount(cat._id);
            return (
              <div
                key={cat._id}
                className="bg-white border border-gray-200 hover:border-brand-gold transition overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Folder icon */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center text-2xl flex-shrink-0 ${
                      cat.highlight ? 'bg-brand-gold/10' : 'bg-brand-cream'
                    }`}
                  >
                    📁
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading text-base truncate">
                        {cat.name}
                      </p>
                      {cat.highlight && (
                        <span className="text-[9px] uppercase tracking-widest bg-brand-gold text-white px-2 py-0.5">
                          Highlight
                        </span>
                      )}
                      {!cat.showInNavbar && (
                        <span className="text-[9px] uppercase tracking-widest bg-gray-400 text-white px-2 py-0.5">
                          Hidden
                        </span>
                      )}
                      {!cat.isActive && (
                        <span className="text-[9px] uppercase tracking-widest bg-red-500 text-white px-2 py-0.5">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-grey mt-1">
                      {subCount > 0
                        ? `${subCount} sub-categor${subCount === 1 ? 'y' : 'ies'}`
                        : 'No sub-categories'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Open folder */}
                    <button
                      onClick={() => goInside(cat._id)}
                      className="px-4 py-2 bg-brand-black text-white text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition"
                    >
                      Open →
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(cat)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-brand-gold hover:text-brand-gold transition"
                      title="Edit"
                    >
                      ✎
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(cat)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:border-red-500 hover:text-red-500 transition"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Modal (Add/Edit) ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-xl w-full my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-heading text-lg">
                  {editing ? 'Edit' : 'Add'}{' '}
                  {navStack.length === 0 ? 'Category' : 'Sub-category'}
                </h2>
                <p className="text-xs text-brand-grey mt-0.5">
                  {navStack.length === 0
                    ? 'Ye navbar mein top-level category hoga'
                    : `"${breadcrumb[breadcrumb.length - 1]}" ke andar`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-2xl text-brand-grey hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-grey font-medium mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Kurtis"
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-grey font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Short description..."
                  className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none resize-none"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-grey font-medium mb-2">
                  Kis number par dikhe? (Order)
                </label>
                <input
                  type="number"
                  value={formData.menuOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      menuOrder: Number(e.target.value),
                    })
                  }
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none"
                />
                <p className="text-[11px] text-brand-grey mt-1">
                  Chhota number = pehle dikhega (1, 2, 3...)
                </p>
              </div>

              {/* Parent — only if editing an existing category */}
              {editing && (
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-grey font-medium mb-2">
                    Parent Category (kis ke andar)
                  </label>
                  <select
                    value={formData.parentCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentCategory: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none cursor-pointer"
                  >
                    <option value="">— None (Top Level) —</option>
                    {allCategories
                      .filter(
                        (c) =>
                          c._id !== editing._id &&
                          !isDescendantOf(c._id, editing._id)
                      )
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Toggles */}
              <div className="grid grid-cols-1 gap-2 pt-2">
                <label
                  className={`flex items-center gap-3 p-3 border cursor-pointer transition ${
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
                    className="accent-brand-gold w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-[11px] text-brand-grey">
                      Website par dikhayein
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 border cursor-pointer transition ${
                    formData.showInNavbar
                      ? 'border-brand-gold bg-brand-cream'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.showInNavbar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showInNavbar: e.target.checked,
                      })
                    }
                    className="accent-brand-gold w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">Navbar mein dikhayein</p>
                    <p className="text-[11px] text-brand-grey">
                      Uncheck karo to navbar se ghayab ho jayega
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 border cursor-pointer transition ${
                    formData.highlight
                      ? 'border-brand-gold bg-brand-cream'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.highlight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        highlight: e.target.checked,
                      })
                    }
                    className="accent-brand-gold w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      Highlight (special color)
                    </p>
                    <p className="text-[11px] text-brand-grey">
                      Sale jaisa gold color
                    </p>
                  </div>
                </label>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand-black text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-brand-gold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-8 border border-gray-300 text-xs uppercase tracking-widest font-medium hover:bg-brand-cream transition"
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

  // Helper: check if catId is descendant of ancestorId
  function isDescendantOf(catId, ancestorId) {
    let current = allCategories.find((c) => c._id === catId);
    while (current && current.parentCategory) {
      if (current.parentCategory._id === ancestorId) return true;
      current = allCategories.find(
        (c) => c._id === current.parentCategory._id
      );
    }
    return false;
  }
};

export default AdminCategories;