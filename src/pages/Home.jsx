import { useEffect } from 'react';
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

const Home = () => {
  const dispatch = useDispatch();
  const { featured, newArrivals, onSale, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchNewArrivals());
    dispatch(fetchOnSale());
    AOS.refresh();
  }, [dispatch]);

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

  return (
    <div>
      <HeroBanner />

      {/* ===== Categories ===== */}
      <section className="container-brand section-padding">
        <div className="text-center mb-14" data-aos="fade-up">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Explore
          </p>
          <h2 className="font-heading text-4xl md:text-5xl mb-3">
            Shop by Category
          </h2>
          <div className="w-16 h-px bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <div key={cat.name} data-aos="fade-up" data-aos-delay={i * 100}>
              <CategoryCard category={cat} size={cat.size} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Featured ===== */}
      <section className="bg-brand-cream section-padding">
        <div className="container-brand">
          <div
            className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4"
            data-aos="fade-up"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
                Curated
              </p>
              <h2 className="font-heading text-3xl md:text-5xl mb-2">
                Featured Products
              </h2>
              <p className="text-sm text-brand-grey">Handpicked just for you</p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors self-start md:self-auto"
            >
              View All
              <span className="w-8 h-px bg-brand-black group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
            </Link>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <ProductList products={featured} loading={loading} />
          </div>
        </div>
      </section>

      {/* ===== Sale Banner ===== */}
      <section className="relative h-125 md:h-150 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl" data-aos="fade-up">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-gold mb-5">
              Limited Time Offer
            </p>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight">
              End of Season Sale
            </h2>
            <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Up to 50% off on selected items
            </p>
            <Link
              to="/products?isOnSale=true"
              className="group inline-flex items-center gap-3 bg-white text-brand-black px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold hover:text-white transition-all duration-500"
            >
              Shop Sale
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== New Arrivals ===== */}
      <section className="container-brand section-padding">
        <div
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4"
          data-aos="fade-up"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
              Fresh
            </p>
            <h2 className="font-heading text-3xl md:text-5xl mb-2">
              New Arrivals
            </h2>
            <p className="text-sm text-brand-grey">
              Latest additions to our collection
            </p>
          </div>
          <Link
            to="/products?sort=newest"
            className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors self-start md:self-auto"
          >
            View All
            <span className="w-8 h-px bg-brand-black group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
          </Link>
        </div>

        <div data-aos="fade-up" data-aos-delay="100">
          <ProductList products={newArrivals} loading={loading} />
        </div>
      </section>

      {/* ===== On Sale ===== */}
      {onSale?.length > 0 && (
        <section className="bg-brand-cream section-padding">
          <div className="container-brand">
            <div
              className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4"
              data-aos="fade-up"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
                  Deals
                </p>
                <h2 className="font-heading text-3xl md:text-5xl mb-2">
                  On Sale
                </h2>
                <p className="text-sm text-brand-grey">
                  Best deals of the season
                </p>
              </div>
              <Link
                to="/products?isOnSale=true"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-brand-gold transition-colors self-start md:self-auto"
              >
                View All
                <span className="w-8 h-px bg-brand-black group-hover:bg-brand-gold group-hover:w-12 transition-all duration-300"></span>
              </Link>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <ProductList products={onSale} loading={loading} />
            </div>
          </div>
        </section>
      )}

      {/* ===== Brand Story ===== */}
      <section className="container-brand section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div
            className="relative aspect-4/5 overflow-hidden"
            data-aos="fade-right"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Roshys Brand"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-4 border border-brand-gold/40 pointer-events-none"></div>
          </div>

          <div data-aos="fade-left" data-aos-delay="200">
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
      <section className="bg-brand-black text-white py-20">
        <div className="container-brand">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'Orders above Rs. 5,000' },
              { icon: '↩️', title: 'Easy Returns', desc: '7 days return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% safe checkout' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
            ].map((feat, i) => (
              <div
                key={feat.title}
                className="text-center group"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  {feat.icon}
                </div>
                <h3 className="font-heading text-base md:text-lg mb-1">
                  {feat.title}
                </h3>
                <p className="text-xs text-white/50">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Instagram ===== */}
      <section className="container-brand section-padding">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            @roshys
          </p>
          <h2 className="font-heading text-3xl md:text-4xl mb-3">
            Follow Us on Instagram
          </h2>
          <p className="text-sm text-brand-grey">Get daily style inspiration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            'photo-1483985988355-763728e1935b',
            'photo-1490578474895-699cd4e2cf59',
            'photo-1519457431-44ccd64a579b',
            'photo-1487222477894-8943e31ef7b2',
            'photo-1496747611176-843222e1e57c',
            'photo-1558769132-cb1aea458c5e',
          ].map((id, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square overflow-hidden"
              data-aos="zoom-in"
              data-aos-delay={i * 80}
            >
              <img
                src={`https://images.unsplash.com/${id}?w=400`}
                alt={`Instagram ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/60 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                  ♥
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;