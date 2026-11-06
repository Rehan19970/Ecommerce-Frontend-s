import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detect karo
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get('/banners?position=hero');
        setBanners(data && data.length > 0 ? data : []);
      } catch (error) {
        console.error('Banner error:', error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  /*
    MOBILE:  banner ka ratio 2:3 (800x1200) rakha hai, taake poori image
             bina kate nazar aaye. Height screen ke 85% se zyada nahi hogi.
    DESKTOP: pehle jaisa full-screen hero (1920x1080).
  */
  const sectionSize =
    'aspect-[2/3] max-h-[85svh] w-full sm:aspect-auto sm:h-[calc(100vh-130px)] sm:min-h-137.5 sm:max-h-225';

  if (loading) {
    return <div className={`${sectionSize} bg-brand-lightgrey animate-pulse`}></div>;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const banner = banners[current];

  return (
    <section className={`relative ${sectionSize} overflow-hidden bg-brand-black`}>
      {/* Slides */}
      {banners.map((b, i) => {
        const hasMobileImg = isMobile && b.mobileImage;
        const imgSrc = hasMobileImg ? b.mobileImage : b.image;

        return (
          <div
            key={b._id || i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className={`absolute inset-0 bg-cover ${
                i === current ? 'animate-slow-zoom' : ''
              }`}
              style={{
                backgroundImage: `url(${imgSrc})`,
                // Mobile image ho to center, warna desktop image mobile par
                // right side focus (jahan model hota hai)
                backgroundPosition:
                  isMobile && !b.mobileImage ? '75% center' : 'center',
              }}
            ></div>

            {/* Mobile: upar se neeche halka gradient (text upar hai)
                Desktop: left se right gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/10 to-black/25 sm:bg-linear-to-r sm:from-black/60 sm:via-black/30 sm:to-black/10"></div>
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-20 h-full flex items-start pt-7 sm:pt-0 sm:items-center">
        <div className="container-brand w-full">
          <div className="max-w-2xl text-white w-full">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-6 animate-fade-up">
              <span className="w-8 sm:w-12 h-px bg-brand-gold"></span>
              <p className="text-[9px] sm:text-xs md:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-gold font-medium">
                {banner.subtitle || 'New Collection'}
              </p>
            </div>

            <h1
              key={current}
              className="font-heading text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.15] sm:leading-[1.05] mb-3 sm:mb-6 line-clamp-2 sm:line-clamp-none animate-fade-up"
            >
              {banner.title}
            </h1>

            {/* Description mobile par hide (jagah kam hoti hai) */}
            <p
              key={`desc-${current}`}
              className="hidden sm:block text-sm md:text-base lg:text-lg text-white/80 mb-8 md:mb-10 max-w-lg leading-relaxed animate-fade-up"
            >
              {banner.description}
            </p>

            <div className="flex flex-row gap-3 sm:gap-4 animate-fade-up">
              <Link
                to={banner.buttonLink || '/products'}
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-brand-black px-5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 md:py-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold hover:text-white transition-all duration-500"
              >
                {banner.buttonText || 'Shop Now'}
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              {/* Explore button mobile par hide */}
              <Link
                to="/products?sort=newest"
                className="hidden sm:inline-flex group items-center justify-center gap-3 border border-white/40 text-white px-8 md:px-10 py-3.5 md:py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-brand-black hover:border-white transition-all duration-500"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-500 ${
                i === current
                  ? 'w-6 sm:w-10 h-0.5 bg-brand-gold'
                  : 'w-3 sm:w-5 h-0.5 bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrows — desktop only */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center border border-white/30 text-white hover:bg-white hover:text-brand-black hover:border-white transition-all duration-300"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center border border-white/30 text-white hover:bg-white hover:text-brand-black hover:border-white transition-all duration-300"
            aria-label="Next"
          >
            →
          </button>
        </>
      )}

      {/* Scroll Indicator — desktop only */}
      <div className="hidden md:flex absolute bottom-10 right-10 z-30 items-center gap-3 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-white/40 relative overflow-hidden">
          <div className="absolute top-0 w-full h-4 bg-brand-gold animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;