import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-[80vh] grid grid-cols-1 lg:grid-cols-2">
      {/* ===== Left — Image ===== */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200"
          alt="Roshys"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-end p-12 text-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Welcome Back
            </p>
            <h2 className="font-heading text-4xl mb-3 leading-tight">
              Timeless Fashion,<br />Crafted for You
            </h2>
            <p className="text-sm text-white/70 max-w-sm">
              Login karein aur apna shopping journey continue karein
            </p>
          </div>
        </div>
      </div>

      {/* ===== Right — Form ===== */}
      <div className="flex items-center justify-center px-6 py-16 lg:py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <Link
              to="/"
              className="font-heading text-3xl font-bold tracking-[0.2em] inline-block mb-8"
            >
              ROSHYS
            </Link>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Sign In
            </p>
            <h1 className="font-heading text-3xl md:text-4xl mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-brand-grey">
              Login karein apne account mein
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border-l-2 border-red-500 text-sm text-red-700 mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] uppercase tracking-widest text-brand-grey hover:text-brand-gold transition"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-grey hover:text-brand-black transition"
                  aria-label="Toggle password"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-brand-grey cursor-pointer">
              <input type="checkbox" className="accent-brand-gold" />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-brand-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-[10px] uppercase tracking-widest text-brand-grey">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-brand-grey">
            Account nahi hai?{' '}
            <Link
              to="/register"
              className="text-brand-black font-medium hover:text-brand-gold transition underline"
            >
              Register karein
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;