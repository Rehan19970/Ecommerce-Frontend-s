import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  closeNewsletterPopup,
  setNewsletterPopupShown,
} from '../features/uiSlice';
import api from '../services/api';

const NewsletterPopup = () => {
  const dispatch = useDispatch();
  const { newsletterPopupShown } = useSelector((state) => state.ui);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);

  // 10 second baad popup dikhao (agar pehle nahi dikha)
  useEffect(() => {
    const shownBefore = localStorage.getItem('newsletterPopupShown');
    const lastShown = localStorage.getItem('newsletterPopupLastShown');

    // Agar 24 ghante ke andar dikha chuka hai to skip
    if (lastShown) {
      const hoursSince = (Date.now() - Number(lastShown)) / (1000 * 60 * 60);
      if (hoursSince < 24) return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      localStorage.setItem('newsletterPopupLastShown', Date.now().toString());
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    dispatch(closeNewsletterPopup());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      setSuccess(true);
      toast.success('Subscribe ho gaya! Shukriya.');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Kuch masla ho gaya';
      if (msg.includes('pehle se')) {
        toast.error('Ye email pehle se subscribed hai');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-100 animate-fade"
        onClick={handleClose}
      ></div>

      {/* Popup */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white max-w-4xl w-full shadow-2xl pointer-events-auto overflow-hidden animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* ===== Left — Image ===== */}
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                alt="Roshys Newsletter"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Floating Gold Badge */}
              <div className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1.5">
                ✦ Exclusive
              </div>
            </div>

            {/* ===== Right — Content ===== */}
            <div className="p-6 md:p-10 relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-brand-grey hover:text-brand-black hover:bg-brand-cream transition text-xl"
              >
                ✕
              </button>

              {success ? (
                /* ===== Success State ===== */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-brand-gold"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="font-heading text-2xl mb-2">
                    Shukriya!
                  </h3>
                  <p className="text-sm text-brand-grey">
                    Aap subscribe ho gaye. Jald hi updates milengi.
                  </p>
                </div>
              ) : (
                /* ===== Form State ===== */
                <>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
                    Newsletter
                  </p>

                  <h3 className="font-heading text-3xl md:text-4xl mb-3 leading-tight">
                    Get <span className="text-brand-gold italic">10% Off</span>
                    <br />
                    Your First Order
                  </h3>

                  <p className="text-sm text-brand-grey mb-6 leading-relaxed">
                    Subscribe karein aur exclusive offers, naye collections,
                    aur special discounts ki updates sab se pehle payein.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                      className="w-full px-4 py-3.5 border border-gray-300 text-sm focus:border-brand-gold focus:outline-none transition"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full bg-brand-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe Now
                          <span className="transform group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </>
                      )}
                    </button>
                  </form>

                  <button
                    onClick={handleClose}
                    className="w-full text-center mt-4 text-[10px] uppercase tracking-widest text-brand-grey hover:text-brand-black transition"
                  >
                    No thanks, I'll pay full price
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsletterPopup;