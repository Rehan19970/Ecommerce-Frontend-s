import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import HeroBanner from '../components/HeroBanner';
import ProductList from '../components/ProductList';
import CategoryCard from '../components/CategoryCard';
import {
  fetchFeatured,
  fetchNewArrivals,
  fetchOnSale,
} from '../features/productSlice';

/* ============================================================
   CONFIG - yahan se apni values change karo
   ============================================================ */
const SALE_END = new Date('2026-11-30T23:59:59'); // sale khatam hone ki date
const INSTAGRAM_URL = 'https://www.instagram.com/roshys'; // apna asli link lagao

const categories = [
  {
    name: 'Women',
    subtitle: 'Collection',
    link: '/products?category=women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    size: 'tall',
  },
  {
    name: 'Men',
    subtitle: 'New In',
    link: '/products?category=men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800',
    size: 'tall',
  },
  {
    name: 'Kids',
    subtitle: 'Playful',
    link: '/products?category=kids',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800',
    size: 'tall',
  },
  {
    name: 'Unstitched',
    subtitle: 'Fabric',
    link: '/products?category=unstitched',
    image: 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800',
    size: 'tall',
  },
];

const instagramPhotos = [
  'photo-1483985988355-763728e1935b',
  'photo-1490578474895-699cd4e2cf59',
  'photo-1519457431-44ccd64a579b',
  'photo-1487222477894-8943e31ef7b2',
  'photo-1496747611176-843222e1e57c',
  'photo-1558769132-cb1aea458c5e',
];

const marqueeItems = [
  'Free Shipping above Rs. 5,000',
  'Easy 7 Days Returns',
  'Cash on Delivery Available',
  'Premium Quality Fabrics',
  'Delivery All Over Pakistan',
];

/* ============================================================
   SVG ICONS (koi extra package nahi chahiye)
   ============================================================ */
const iconProps = {
  width: 36,
  height: 36,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const TruckIcon = () => (
  <svg {...iconProps}>
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ReturnIcon = () => (
  <svg {...iconProps}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ChatIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 21s-7.5-4.6-9.6-9.3C.8 8.2 2.6 4 6.4 4c2.1 0 3.7 1.2 4.6 2.7h2C13.900 5.200 15.500 4 17.600 4c3.800 0 5.600 4.200 4 7.700C19.500 16.400 12 21 12 21z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const features = [
  { Icon: TruckIcon, title: 'Free Shipping', desc: 'Orders above Rs. 5,000' },
  { Icon: ReturnIcon, title: 'Easy Returns', desc: '7 days return policy' },
  { Icon: ShieldIcon, title: 'Secure Payment', desc: '100% safe checkout' },
  { Icon: ChatIcon, title: '24/7 Support', desc: 'Always here to help' },
];

/* ============================================================
   REUSABLE PIECES
   ============================================================ */
const ViewAllLink = ({ to }) => (
  <Link
    to={to}
    className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors self-start md:self-auto"
  >
    View All
    <span className="w-8 h-px bg-brand-black group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
  </Link>
);

const SectionHeader = ({ eyebrow, title, subtitle, to }) => (
  <div
    className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 md:mb-12 gap-4"
    data-aos="fade-up"
  >
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
        {eyebrow}
      </p>
      <h2 className="font-heading text-3xl md:text-5xl mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-brand-grey">{subtitle}</p>}
    </div>
    {to && <ViewAllLink to={to} />}
  </div>
);

/* Products ke around min-height taake layout jump na ho.
   AOS yahan jaan boojh kar nahi lagaya taake cards ruk kar show na hon. */
const ProductsBlock = ({ products, loading }) => (
  <div className="min-h-[420px]">
    <ProductList products={products} loading={loading} />
  </div>
);

/* ============================================================
   COUNTDOWN
   ============================================================ */
const getTimeLeft = () => {
  const diff = SALE_END.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Countdown = () => {
  const [left, setLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!left) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const units = [
    ['Days', left.days],
    ['Hours', left.hours],
    ['Mins', left.minutes],
    ['Secs', left.seconds],
  ];

  return (
    <div
      className="flex justify-center gap-3 md:gap-5 mb-8 md:mb-10"
      aria-label="Sale countdown"
    >
      {units.map(([label, value]) => (
        <div
          key={label}
          className="w-16 md:w-20 py-3 border border-white/30 backdrop-blur-sm bg-white/5"
        >
          <div className="font-heading text-2xl md:text-3xl leading-none">
            {pad(value)}
          </div>
          <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/60 mt-2">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   MAIN PAGE
   ============================================================ */
const Home = () => {
  const dispatch = useDispatch();
  const { featured, newArrivals, onSale, loading } = useSelector(
    (state) => state.products
  );

  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // 1) Data fetch
  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchNewArrivals());
    dispatch(fetchOnSale());
  }, [dispatch]);

  // 2) AOS sirf ek dafa init
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 40,
      easing: 'ease-out-cubic',
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  // 3) Data aane par page lamba hota hai, to AOS ki positions dobara calculate karo
  useEffect(() => {
    const t = setTimeout(() => AOS.refreshHard(), 150);
    return () => clearTimeout(t);
  }, [featured, newArrivals, onSale, loading]);

  // 4) Back to top button
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: yahan apni API call lagao (e.g. dispatch(subscribeNewsletter(email)))
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="overflow-hidden">
      <HeroBanner />

      {/* ===== Marquee Strip ===== */}
      <div className="bg-brand-black text-white py-3 overflow-hidden" aria-hidden="true">
        <div className="home-marquee flex w-max whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map(
            (text, i) => (
              <span
                key={i}
                className="mx-8 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/80"
              >
                {text}
                <span className="ml-8 text-brand-gold">&#9670;</span>
              </span>
            )
          )}
        </div>
      </div>

      {/* ===== Categories ===== */}
      <section className="container-brand section-padding">
        <div className="text-center mb-10 md:mb-14" data-aos="fade-up">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Explore
          </p>
          <h2 className="font-heading text-3xl md:text-5xl mb-3">
            Shop by Category
          </h2>
          <div className="w-16 h-px bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {categories.map((cat, i) => (
            <div key={cat.name} data-aos="fade-up" data-aos-delay={i * 80}>
              <CategoryCard category={cat} size={cat.size} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Featured ===== */}
      <section className="bg-brand-cream section-padding">
        <div className="container-brand">
          <SectionHeader
            eyebrow="Curated"
            title="Featured Products"
            subtitle="Handpicked just for you"
            to="/products"
          />
          <ProductsBlock products={featured} loading={loading} />
        </div>
      </section>

      {/* ===== Sale Banner ===== */}
      <section className="relative h-[480px] md:h-[640px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center home-kenburns"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75"></div>

        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl" data-aos="zoom-in">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-gold mb-4 md:mb-5">
              Limited Time Offer
            </p>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-5 leading-tight">
              End of Season Sale
            </h2>
            <p className="text-sm md:text-lg text-white/80 mb-6 md:mb-8 max-w-xl mx-auto">
              Up to 50% off on selected items
            </p>

            <Countdown />

            <Link
              to="/products?isOnSale=true"
              className="group inline-flex items-center gap-3 bg-white text-brand-black px-8 md:px-10 py-3 md:py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold hover:text-white transition-all duration-500"
            >
              Shop Sale
              <span className="transform group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== New Arrivals ===== */}
      <section className="container-brand section-padding">
        <SectionHeader
          eyebrow="Fresh"
          title="New Arrivals"
          subtitle="Latest additions to our collection"
          to="/products?sort=newest"
        />
        <ProductsBlock products={newArrivals} loading={loading} />
      </section>

      {/* ===== On Sale ===== */}
      {onSale?.length > 0 && (
        <section className="bg-brand-cream section-padding">
          <div className="container-brand">
            <SectionHeader
              eyebrow="Deals"
              title="On Sale"
              subtitle="Best deals of the season"
              to="/products?isOnSale=true"
            />
            <ProductsBlock products={onSale} loading={loading} />
          </div>
        </section>
      )}

      {/* ===== Brand Story ===== */}
      <section className="container-brand section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div
            className="relative aspect-[4/5] overflow-hidden"
            data-aos="fade-right"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Roshys Brand"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-4 border border-brand-gold/40 pointer-events-none"></div>
          </div>

          <div data-aos="fade-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Our Story
            </p>
            <h2 className="font-heading text-3xl md:text-5xl mb-6 leading-tight">
              Crafted with Passion, Worn with Pride
            </h2>
            <p className="text-sm text-brand-grey leading-relaxed mb-4">
              Roshys 2025 mein shuru hua — ek simple soch ke saath: Pakistani
              logon ko premium quality clothing mile.
            </p>
            <p className="text-sm text-brand-grey leading-relaxed mb-8">
              Aaj hum Pakistan bhar mein deliver karte hain — lawn se lekar
              embroidered suits tak.
            </p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors"
            >
              Read More
              <span className="w-8 h-px bg-brand-black group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="bg-brand-black text-white py-16 md:py-20">
        <div className="container-brand">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
            {features.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="text-center group"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-brand-gold/40 text-brand-gold mb-4 transition-all duration-500 group-hover:bg-brand-gold group-hover:text-brand-black group-hover:scale-110">
                  <Icon />
                </div>
                <h3 className="font-heading text-sm md:text-lg mb-1">{title}</h3>
                <p className="text-[10px] md:text-xs text-white/50">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Newsletter ===== */}
      <section className="bg-brand-cream section-padding">
        <div className="container-brand">
          <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Stay Connected
            </p>
            <h2 className="font-heading text-3xl md:text-4xl mb-3">
              Join the Roshys Family
            </h2>
            <p className="text-sm text-brand-grey mb-8">
              New collections aur exclusive offers sab se pehle apne inbox ma
              paayen.
            </p>

            {subscribed ? (
              <p className="text-sm text-brand-gold tracking-wide" role="status">
                Shukriya! Aap subscribe ho gaye hain.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-5 py-3 md:py-4 bg-white border border-brand-black/15 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 md:px-10 py-3 md:py-4 bg-brand-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-colors duration-500"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== Instagram ===== */}
      <section className="container-brand section-padding">
        <div className="text-center mb-8 md:mb-12" data-aos="fade-up">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            @roshys
          </p>
          <h2 className="font-heading text-3xl md:text-4xl mb-3">
            Follow Us on Instagram
          </h2>
          <p className="text-sm text-brand-grey">Get daily style inspiration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {instagramPhotos.map((id, i) => (
            <a
              key={id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram post ${i + 1}`}
              className="group relative aspect-square overflow-hidden"
              data-aos="zoom-in"
              data-aos-delay={i * 60}
            >
              <img
                src={`https://images.unsplash.com/${id}?w=400`}
                alt={`Instagram ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/60 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <HeartIcon />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== Back to Top ===== */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 flex items-center justify-center bg-brand-black text-white border border-brand-gold/40 hover:bg-brand-gold transition-all duration-500 ${
          showTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUpIcon />
      </button>

      {/* Page-specific animations (marquee + slow zoom) */}
      <style>{`
        @keyframes home-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .home-marquee { animation: home-marquee 40s linear infinite; }
        .home-marquee:hover { animation-play-state: paused; }

        @keyframes home-kenburns {
          from { transform: scale(1); }
          to   { transform: scale(1.08); }
        }
        .home-kenburns {
          animation: home-kenburns 18s ease-out infinite alternate;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-marquee, .home-kenburns { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;