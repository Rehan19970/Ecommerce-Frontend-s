import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/authSlice';
import { fetchCart } from '../features/cartSlice';
import { openCartDrawer } from '../features/uiSlice';
import { fetchNavbarCategories } from '../features/categorySlice';
import SearchBar from './SearchBar';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const hoverTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { navbarCategories } = useSelector((state) => state.category);

  useEffect(() => {
    if (userInfo) dispatch(fetchCart());
    dispatch(fetchNavbarCategories());
  }, [userInfo, dispatch]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setUserMenu(false);
    if (userMenu) {
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
    }
  }, [userMenu]);

  useEffect(() => {
    setMobileMenu(false);
    setSearchOpen(false);
    setHoveredItem(null);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenu(false);
    navigate('/');
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    dispatch(openCartDrawer());
  };

  const handleMouseEnter = (catId) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredItem(catId);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
  };

  // ===== Mega Menu Render =====
  const renderMegaMenu = (category) => {
    if (!category.children || category.children.length === 0) return null;

    return (
      <div
        className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-40"
        onMouseEnter={() => handleMouseEnter(category._id)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container-brand py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {category.children.slice(0, 4).map((col) => (
              <div key={col._id}>
                <h4 className="text-[11px] uppercase tracking-[0.25em] text-brand-black font-medium mb-4 pb-2 border-b border-gray-200">
                  {col.name}
                </h4>
                <ul className="space-y-2.5">
                  {col.children?.slice(0, 8).map((sub) => (
                    <li key={sub._id}>
                      <Link
                        to={`/products?category=${sub.slug}`}
                        onClick={() => setHoveredItem(null)}
                        className="text-sm text-brand-grey hover:text-brand-gold transition-colors duration-300 inline-block"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                  {col.children?.length > 8 && (
                    <li>
                      <Link
                        to={`/products?category=${col.slug}`}
                        className="text-xs text-brand-gold hover:underline"
                      >
                        + more
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'
          }`}
      >
        <div className="container-brand">
          <div className="flex items-center justify-between h-14 gap-4">
            <button
              className="lg:hidden text-xl text-brand-black hover:text-brand-gold transition"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Menu"
            >
              {mobileMenu ? '✕' : '☰'}
            </button>

            {/* Left Desktop Nav — Dynamic */}
            <nav className="hidden lg:flex items-center gap-7 flex-1">
              {navbarCategories.slice(0, 3).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug}`}
                  onMouseEnter={() => handleMouseEnter(cat._id)}
                  onMouseLeave={handleMouseLeave}
                  className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 relative group ${cat.highlight
                      ? cat.highlightColor === 'red'
                        ? 'text-red-500'
                        : 'text-brand-gold'
                      : 'text-brand-black hover:text-brand-gold'
                    }`}
                >
                  {cat.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${cat.highlight && cat.highlightColor === 'red'
                        ? 'bg-red-500'
                        : 'bg-brand-gold'
                      }`}
                  ></span>
                </Link>
              ))}
            </nav>

            {/* Center — Logo */}
            <Link
              to="/"
              className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              onMouseEnter={() => setHoveredItem(null)}
            >
              <h1 className="font-heading text-2xl md:text-3xl lg:text-[30px] font-bold tracking-[0.2em] text-brand-black">
                ROSHYS
              </h1>
            </Link>

            {/* Right — Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="hover:text-brand-gold transition"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </button>

              {userInfo ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenu(!userMenu);
                    }}
                    className="hover:text-brand-gold transition"
                    aria-label="Account"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl py-2 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-brand-black">
                          {userInfo.name}
                        </p>
                        <p className="text-xs text-brand-grey mt-0.5 truncate">
                          {userInfo.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenu(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-brand-cream hover:text-brand-gold transition"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenu(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-brand-cream hover:text-brand-gold transition"
                      >
                        My Orders
                      </Link>

                      {/* === TRACK ORDER (Login ke baad) === */}
                      <Link
                        to="/track-order"
                        onClick={() => setUserMenu(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-brand-cream hover:text-brand-gold transition"
                      >
                        Track Order
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenu(false)}
                        className="block px-4 py-2.5 text-sm hover:bg-brand-cream hover:text-brand-gold transition"
                      >
                        Wishlist
                      </Link>

                      {userInfo.role === 'admin' && (
                        <>
                          <hr className="my-2 border-gray-100" />
                          <Link
                            to="/admin"
                            onClick={() => setUserMenu(false)}
                            className="block px-4 py-2.5 text-sm text-brand-gold font-medium hover:bg-brand-cream transition"
                          >
                            ⚡ Admin Panel
                          </Link>
                        </>
                      )}

                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:block text-xs uppercase tracking-[0.15em] font-medium hover:text-brand-gold transition"
                >
                  Login
                </Link>
              )}

              <button
                onClick={handleCartClick}
                className="relative hover:text-brand-gold transition"
                aria-label="Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ===== Categories Bar — Dynamic + Mega Menu ===== */}
        <div
          className="hidden lg:block border-t border-gray-100 relative"
          onMouseLeave={handleMouseLeave}
        >
          <div className="container-brand">
            <ul className="flex items-center justify-center gap-10 h-9">
              {navbarCategories.map((cat) => (
                <li
                  key={cat._id}
                  onMouseEnter={() => handleMouseEnter(cat._id)}
                  className="relative"
                >
                  <Link
                    to={`/products?category=${cat.slug}`}
                    className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 relative group inline-block ${cat.highlight
                        ? cat.highlightColor === 'red'
                          ? 'text-red-500'
                          : 'text-brand-gold'
                        : 'text-brand-black hover:text-brand-gold'
                      }`}
                  >
                    {cat.name}
                    <span
                      className={`absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${cat.highlight && cat.highlightColor === 'red'
                          ? 'bg-red-500'
                          : 'bg-brand-gold'
                        }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mega Menu */}
          {navbarCategories.map(
            (cat) =>
              hoveredItem === cat._id && (
                <div key={cat._id}>{renderMegaMenu(cat)}</div>
              )
          )}
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-55"
              onClick={() => setSearchOpen(false)}
            ></div>
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-60">
              <div className="container-brand py-5">
                <SearchBar
                  autoFocus
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setMobileMenu(false)}
          ></div>
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden animate-fade shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading text-xl font-bold tracking-[0.2em]">
                ROSHYS
              </h2>
              <button
                onClick={() => setMobileMenu(false)}
                className="text-2xl hover:text-brand-gold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <SearchBar isMobile />
              </div>

              {userInfo && (
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest text-brand-grey mb-1">
                    Welcome back
                  </p>
                  <p className="font-medium text-brand-black">{userInfo.name}</p>
                </div>
              )}

              {/* Mobile Categories — Accordion */}
              <ul className="space-y-1">
                {navbarCategories.map((cat) => (
                  <li key={cat._id}>
                    <details>
                      <summary
                        className={`block py-3 text-sm uppercase tracking-[0.15em] font-medium border-b border-gray-100 cursor-pointer ${cat.highlight
                            ? cat.highlightColor === 'red'
                              ? 'text-red-500'
                              : 'text-brand-gold'
                            : 'text-brand-black'
                          }`}
                      >
                        {cat.name}
                      </summary>
                      {cat.children?.length > 0 && (
                        <ul className="pl-4 py-2 space-y-2 bg-brand-cream">
                          {cat.children.map((sub) => (
                            <li key={sub._id}>
                              <Link
                                to={`/products?category=${sub.slug}`}
                                onClick={() => setMobileMenu(false)}
                                className="block py-2 text-xs text-brand-grey hover:text-brand-gold"
                              >
                                — {sub.name}
                              </Link>
                              {sub.children?.length > 0 && (
                                <ul className="pl-3 mt-1 space-y-1">
                                  {sub.children.map((ssub) => (
                                    <li key={ssub._id}>
                                      <Link
                                        to={`/products?category=${ssub.slug}`}
                                        onClick={() => setMobileMenu(false)}
                                        className="block py-1.5 text-[11px] text-brand-grey hover:text-brand-gold"
                                      >
                                        · {ssub.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </details>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {userInfo ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenu(false)}
                      className="block py-2 text-sm uppercase tracking-widest hover:text-brand-gold"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileMenu(false)}
                      className="block py-2 text-sm uppercase tracking-widest hover:text-brand-gold"
                    >
                      My Orders
                    </Link>

                    {/* === TRACK ORDER (Mobile - Login ke baad) === */}
                    <Link
                      to="/track-order"
                      onClick={() => setMobileMenu(false)}
                      className="block py-2 text-sm uppercase tracking-widest hover:text-brand-gold"
                    >
                      Track Order
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenu(false)}
                      className="block py-2 text-sm uppercase tracking-widest hover:text-brand-gold"
                    >
                      Wishlist
                    </Link>
                    {userInfo.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenu(false)}
                        className="block py-2 text-sm uppercase tracking-widest text-brand-gold font-medium"
                      >
                        ⚡ Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-sm uppercase tracking-widest text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenu(false)}
                      className="block py-3 text-center bg-brand-black text-white text-xs uppercase tracking-[0.2em] hover:bg-brand-gold transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenu(false)}
                      className="block py-3 text-center border border-brand-black text-xs uppercase tracking-[0.2em] hover:bg-brand-black hover:text-white transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;