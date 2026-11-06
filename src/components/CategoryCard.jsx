import { Link } from 'react-router-dom';

const CategoryCard = ({ category, size = 'normal' }) => {
  // Size variations
  const sizeClasses = {
    small: 'aspect-[3/4]',
    normal: 'aspect-[3/4]',
    large: 'aspect-[4/5] md:aspect-[3/4]',
    wide: 'aspect-[4/3] md:aspect-[16/9]',
    tall: 'aspect-[3/4] md:aspect-[2/3]',
  };

  const titleSizes = {
    small: 'text-xl md:text-2xl',
    normal: 'text-2xl md:text-3xl',
    large: 'text-3xl md:text-5xl',
    wide: 'text-2xl md:text-4xl',
    tall: 'text-2xl md:text-3xl',
  };

  return (
    <Link
      to={category.link}
      className={`group relative overflow-hidden block ${sizeClasses[size]}`}
    >
      {/* Background Image */}
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/80 group-hover:via-black/40 transition-all duration-500"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
        {/* Subtitle */}
        {category.subtitle && (
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-gold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
            {category.subtitle}
          </p>
        )}

        {/* Title */}
        <h3
          className={`font-heading font-bold tracking-wide mb-3 ${titleSizes[size]}`}
        >
          {category.name}
        </h3>

        {/* CTA */}
        <div className="flex items-center gap-3 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-0">
            Shop Now
          </span>
          <span className="w-8 h-px bg-white group-hover:w-12 group-hover:bg-brand-gold transition-all duration-500"></span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;