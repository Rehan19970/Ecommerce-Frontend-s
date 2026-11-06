import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearSuccess } from '../features/authSlice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    password: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userInfo) navigate('/login');
  }, [userInfo, navigate]);

  useEffect(() => {
    if (success) {
      setMessage('✓ Profile update ho gayi!');
      setFormData((prev) => ({ ...prev, password: '' }));
      dispatch(clearSuccess());
      setTimeout(() => setMessage(''), 3000);
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    if (!data.password) delete data.password;
    dispatch(updateProfile(data));
  };

  if (!userInfo) return null;

  const sidebarLinks = [
    { name: 'Profile Info', link: '/profile', icon: '👤', active: true },
    { name: 'My Orders', link: '/orders', icon: '📦' },
    { name: 'Wishlist', link: '/wishlist', icon: '♡' },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-brand-cream border-b border-gray-200">
        <div className="container-brand py-12 md:py-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Account
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-3">
            My Profile
          </h1>
          <p className="text-sm text-brand-grey">
            Apni details manage karein
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="container-brand py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-brand-cream border border-gray-200 p-6 md:sticky md:top-32">
              {/* Avatar */}
              <div className="text-center pb-6 mb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-brand-black text-white rounded-full flex items-center justify-center text-2xl font-heading font-bold mx-auto mb-3">
                  {userInfo.name?.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium text-sm">{userInfo.name}</p>
                <p className="text-xs text-brand-grey truncate">
                  {userInfo.email}
                </p>
              </div>

              {/* Links */}
              <ul className="space-y-1">
                {sidebarLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.link}
                      className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                        link.active
                          ? 'bg-brand-black text-white'
                          : 'hover:bg-white hover:text-brand-gold'
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
                {userInfo.role === 'admin' && (
                  <li>
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium text-brand-gold hover:bg-white transition"
                    >
                      ⚡ Admin Panel
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="bg-white border border-gray-200 p-6 md:p-10">
              <h2 className="font-heading text-2xl mb-2">
                Update Information
              </h2>
              <p className="text-sm text-brand-grey mb-8">
                Apni details yahan update karein
              </p>

              {message && (
                <div className="p-4 bg-green-50 border-l-2 border-green-500 text-sm text-green-700 mb-6">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                </div>

                <div className="pt-5 border-t border-gray-200">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Khaali chhod dein agar change nahi karni"
                    className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                  />
                  <p className="text-xs text-brand-grey mt-2">
                    Kam se kam 6 characters
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group bg-brand-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 disabled:opacity-50 flex items-center gap-3"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Changes
                        <span className="transform group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;