import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-100 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920"
          alt="About Roshys"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-gold mb-5">
              Our Story
            </p>
            <h1 className="font-heading text-5xl md:text-7xl mb-5 leading-tight">
              About Roshys
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
              Premium fashion for the modern Pakistani
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-brand section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-4">
              Our Story
            </p>
            <h2 className="font-heading text-3xl md:text-5xl mb-6 leading-tight">
              Crafted with Passion, Worn with Pride
            </h2>
            <div className="space-y-4 text-sm text-brand-grey leading-relaxed">
              <p>
                Roshys 2025 mein shuru hua — ek simple soch ke saath: Pakistani
                logon ko premium quality clothing mile, jo affordable bhi ho aur
                stylish bhi.
              </p>
              <p>
                Aaj hum Pakistan bhar mein deliver karte hain — lawn se lekar
                embroidered suits tak, men's fashion se lekar kids clothing tak.
                Har product carefully select kiya jata hai.
              </p>
              <p>
                Hamara maqsad hai ke har Pakistani ghar mein premium fashion
                pohanchaye — bina kisi compromise ke.
              </p>
            </div>
          </div>

          <div className="relative aspect-4/5 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
              alt="Roshys Story"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-6 border border-brand-gold/40 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-black text-white py-20">
        <div className="container-brand">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { num: '10,000+', label: 'Happy Customers' },
              { num: '500+', label: 'Products' },
              { num: '50+', label: 'Cities Delivered' },
              { num: '4.8', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-4xl md:text-5xl text-brand-gold mb-2">
                  {stat.num}
                </p>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-brand section-padding">
        <div className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-3">
            Our Values
          </p>
          <h2 className="font-heading text-3xl md:text-5xl mb-3">
            What We Stand For
          </h2>
          <div className="w-16 h-px bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '✨',
              title: 'Quality First',
              desc: 'Har product carefully select kiya jata hai — quality kabhi compromise nahi.',
            },
            {
              icon: '❤️',
              title: 'Customer Love',
              desc: 'Aapki khushi hamari priority hai. 24/7 support aur easy returns.',
            },
            {
              icon: '🚚',
              title: 'Fast Delivery',
              desc: 'Pakistan bhar mein fast aur reliable delivery — har order ke saath.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="text-center p-8 border border-gray-200 hover:border-brand-gold hover:shadow-lg transition-all duration-500"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="font-heading text-xl mb-3">{value.title}</h3>
              <p className="text-sm text-brand-grey leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-cream section-padding">
        <div className="container-brand text-center">
          <h2 className="font-heading text-3xl md:text-5xl mb-4">
            Ready to Shop?
          </h2>
          <p className="text-sm text-brand-grey mb-8 max-w-xl mx-auto">
            Latest collection explore karein aur apna style dhoondein
          </p>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 bg-brand-black text-white px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition-all duration-500"
          >
            Explore Collection
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;