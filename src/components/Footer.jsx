import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/newsletter', { email });
      setMessage({ type: 'success', text: '✓ Subscribe ho gaya!' });
      setEmail('');
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Kuch masla ho gaya',
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } finally {
      setLoading(false);
    }
  };

  const shopLinks = [
    { name: 'New In', link: '/products?sort=newest' },
    { name: 'Women', link: '/products?category=women' },
    { name: 'Men', link: '/products?category=men' },
    { name: 'Kids', link: '/products?category=kids' },
    { name: 'Sale', link: '/products?isOnSale=true' },
  ];

  const helpLinks = [
    { name: 'Contact', link: '/contact' },
    { name: 'About', link: '/about' },
    { name: 'Track Order', link: '/track-order' }, // <-- Yeh /orders se /track-order kar diya
    { name: 'Returns', link: '#' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: '#',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-brand-cream border-t border-gray-200 mt-20">
      {/* ===== Main Footer ===== */}
      <div className="container-brand py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand — 4 cols */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <h3 className="font-heading text-2xl font-bold tracking-[0.2em] text-brand-black">
                ROSHYS
              </h3>
            </Link>
            <p className="text-xs text-brand-grey leading-relaxed mb-5 max-w-xs">
              Premium fashion for the modern Pakistani. Quality clothing for
              men, women, and kids.
            </p>

            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-8 h-8 border border-gray-300 text-brand-black flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop — 2 cols */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-brand-black mb-4 font-medium">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-xs text-brand-grey hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help — 2 cols */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-brand-black mb-4 font-medium">
              Help
            </h4>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-xs text-brand-grey hover:text-brand-gold transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter — 4 cols */}
          <div className="col-span-2 md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-brand-black mb-4 font-medium">
              Newsletter
            </h4>
            <p className="text-xs text-brand-grey mb-4">
              Naye collections aur sales ki updates payein
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-gray-300 focus:border-brand-gold px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-black text-white px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-brand-gold transition-all duration-300 disabled:opacity-50"
              >
                {loading ? '...' : 'Join'}
              </button>
            </form>

            {message.text && (
              <p
                className={`text-[10px] mt-2 ${
                  message.type === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="border-t border-gray-300">
        <div className="container-brand py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-brand-grey tracking-wider">
              © {new Date().getFullYear()} ROSHYS. All rights reserved.
            </p>

            <div className="flex items-center gap-5 text-[10px] text-brand-grey">
              <a href="#" className="hover:text-brand-gold transition">
                Privacy
              </a>
              <a href="#" className="hover:text-brand-gold transition">
                Terms
              </a>
              <span className="text-gray-400">|</span>
              <span>COD · JazzCash · Easypaisa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;