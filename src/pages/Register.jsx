import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../features/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs = {};
    if (formData.name.trim().length < 2)
      errs.name = 'Naam kam se kam 2 characters';
    if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Sahi email daalein';
    if (formData.password.length < 6)
      errs.password = 'Password kam se kam 6 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords match nahi karte';
    if (formData.phone && !/^[0-9+\-\s]{10,15}$/.test(formData.phone))
      errs.phone = 'Sahi phone number daalein';
    if (!agreeTerms) errs.agreeTerms = 'Terms accept karein';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })
    );
  };

  return (
    <div className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-2">
      {/* ===== Left — Image ===== */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
          alt="Roshys"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-end p-12 text-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Join Roshys
            </p>
            <h2 className="font-heading text-4xl mb-3 leading-tight">
              Become Part of<br />Our Family
            </h2>
            <p className="text-sm text-white/70 max-w-sm">
              Register karein aur exclusive offers, early access aur zyada payein
            </p>
          </div>
        </div>
      </div>

      {/* ===== Right — Form ===== */}
      <div className="flex items-center justify-center px-6 py-16 lg:py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link
              to="/"
              className="font-heading text-3xl font-bold tracking-[0.2em] inline-block mb-8"
            >
              ROSHYS
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Sign Up
            </p>
            <h1 className="font-heading text-3xl md:text-4xl mb-2">
              Create Account
            </h1>
            <p className="text-sm text-brand-grey">
              Roshys mein shamil hon — free hai
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-2 border-red-500 text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ahmed Khan"
                className={`w-full px-4 py-3 border text-sm focus:outline-none transition ${
                  errors.name
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-brand-gold'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border text-sm focus:outline-none transition ${
                  errors.email
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-brand-gold'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                Phone (optional)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03001234567"
                className={`w-full px-4 py-3 border text-sm focus:outline-none transition ${
                  errors.phone
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-brand-gold'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 border text-sm focus:outline-none transition ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-brand-gold'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-black"
                  aria-label="Toggle password"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border text-sm focus:outline-none transition ${
                  errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-brand-gold'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <label className="flex items-start gap-2 text-xs text-brand-grey cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="accent-brand-gold mt-0.5"
              />
              <span>
                Main{' '}
                <a href="#" className="text-brand-black underline">
                  Terms & Conditions
                </a>{' '}
                aur{' '}
                <a href="#" className="text-brand-black underline">
                  Privacy Policy
                </a>{' '}
                se agree karta hoon
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-600 -mt-3">{errors.agreeTerms}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-brand-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-brand-grey mt-8">
            Pehle se account hai?{' '}
            <Link
              to="/login"
              className="text-brand-black font-medium hover:text-brand-gold transition underline"
            >
              Login karein
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;