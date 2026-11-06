import { useState, useRef } from 'react';

const ImageZoom = ({ src, alt = 'Product' }) => {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-3/4 overflow-hidden bg-brand-lightgrey cursor-zoom-in group"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-200"
        style={{
          transform: isZooming ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
        }}
      />

      {/* Zoom hint badge */}
      {!isZooming && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-brand-black text-[10px] uppercase tracking-widest font-medium px-3 py-1.5 flex items-center gap-1.5 pointer-events-none">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0zM11 8v6m3-3H8"
            />
          </svg>
          Hover to Zoom
        </div>
      )}
    </div>
  );
};

export default ImageZoom;