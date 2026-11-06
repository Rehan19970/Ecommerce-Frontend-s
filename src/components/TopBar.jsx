import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="bg-brand-black text-white text-xs tracking-wider">
      <div className="container-brand">
        <div className="flex items-center justify-between h-10">
          {/* Left — Announcement */}
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-brand-gold rounded-full"></span>
            <p className="uppercase">
              Free Shipping on Orders Above Rs. 5,000
            </p>
          </div>

          {/* Center — Mobile announcement */}
          <p className="md:hidden text-center w-full uppercase text-[10px]">
            Free Shipping Above Rs. 5,000
          </p>

          {/* Right — Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/orders"
              className="hover:text-brand-gold transition-colors duration-300"
            >
              Track Order
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/contact"
              className="hover:text-brand-gold transition-colors duration-300"
            >
              Contact
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/about"
              className="hover:text-brand-gold transition-colors duration-300"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;