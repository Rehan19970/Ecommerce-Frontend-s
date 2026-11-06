import { useState, useEffect, useRef } from 'react';

const CategorySelect = ({ categories, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hoveredMain, setHoveredMain] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const dropdownRef = useRef(null);

  // ===== Selected category ka full path dhoondo =====
  const findCategoryPath = (cats, targetId, path = []) => {
    for (const cat of cats) {
      if (cat._id === targetId) return [...path, cat];
      if (cat.children?.length) {
        const found = findCategoryPath(cat.children, targetId, [...path, cat]);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedPath = value ? findCategoryPath(categories, value) : null;

  // ===== Close on outside click =====
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const handleSelect = (cat) => {
    onChange(cat._id);
    setOpen(false);
    setHoveredMain(null);
    setHoveredSub(null);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* ===== Trigger ===== */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 border border-gray-300 text-sm text-left focus:border-brand-gold focus:outline-none flex items-center justify-between gap-2 bg-white"
      >
        <span className={selectedPath ? 'text-brand-black' : 'text-brand-grey'}>
          {selectedPath
            ? selectedPath.map((c) => c.name).join(' › ')
            : 'Select Category'}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedPath && (
            <span
              onClick={handleClear}
              className="text-brand-grey hover:text-red-500 text-xs px-1"
              title="Clear"
            >
              ✕
            </span>
          )}
          <svg
            className={`w-3 h-3 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ===== Dropdown ===== */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-xl z-50">
          <div className="grid grid-cols-3 min-h-[280px] max-h-[400px]">
            {/* ===== Level 1 — Main Categories ===== */}
            <div className="border-r border-gray-100 overflow-y-auto">
              <p className="text-[9px] uppercase tracking-widest text-brand-grey px-3 py-2 bg-brand-cream sticky top-0">
                Main
              </p>
              <ul>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      type="button"
                      onMouseEnter={() => {
                        setHoveredMain(cat);
                        setHoveredSub(null);
                      }}
                      onClick={() => {
                        if (!cat.children?.length) {
                          handleSelect(cat);
                        } else {
                          setHoveredMain(cat);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-1 transition ${
                        hoveredMain?._id === cat._id
                          ? 'bg-brand-cream text-brand-gold font-medium'
                          : 'hover:bg-gray-50'
                      } ${value === cat._id ? 'bg-brand-gold/10 text-brand-gold' : ''}`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.children?.length > 0 && (
                        <span className="text-[9px] text-brand-grey">›</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ===== Level 2 — Sub Categories ===== */}
            <div className="border-r border-gray-100 overflow-y-auto">
              <p className="text-[9px] uppercase tracking-widest text-brand-grey px-3 py-2 bg-brand-cream sticky top-0">
                {hoveredMain ? hoveredMain.name : 'Sub'}
              </p>
              {!hoveredMain || !hoveredMain.children?.length ? (
                <p className="px-3 py-4 text-[10px] text-brand-grey italic">
                  {hoveredMain ? 'No sub-categories' : 'Hover a category'}
                </p>
              ) : (
                <ul>
                  {hoveredMain.children.map((sub) => (
                    <li key={sub._id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredSub(sub)}
                        onClick={() => {
                          if (!sub.children?.length) {
                            handleSelect(sub);
                          } else {
                            setHoveredSub(sub);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-1 transition ${
                          hoveredSub?._id === sub._id
                            ? 'bg-brand-cream text-brand-gold font-medium'
                            : 'hover:bg-gray-50'
                        } ${value === sub._id ? 'bg-brand-gold/10 text-brand-gold' : ''}`}
                      >
                        <span className="truncate">{sub.name}</span>
                        {sub.children?.length > 0 && (
                          <span className="text-[9px] text-brand-grey">›</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ===== Level 3 — Sub-Sub Categories ===== */}
            <div className="overflow-y-auto">
              <p className="text-[9px] uppercase tracking-widest text-brand-grey px-3 py-2 bg-brand-cream sticky top-0">
                {hoveredSub ? hoveredSub.name : 'Sub-sub'}
              </p>
              {!hoveredSub || !hoveredSub.children?.length ? (
                <p className="px-3 py-4 text-[10px] text-brand-grey italic">
                  {hoveredSub ? 'No more levels' : 'Hover a sub-category'}
                </p>
              ) : (
                <ul>
                  {hoveredSub.children.map((ssub) => (
                    <li key={ssub._id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(ssub)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition truncate ${
                          value === ssub._id
                            ? 'bg-brand-gold/10 text-brand-gold font-medium'
                            : ''
                        }`}
                      >
                        {ssub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ===== Footer hint ===== */}
          <div className="px-3 py-2 border-t border-gray-100 bg-brand-cream/50">
            <p className="text-[9px] text-brand-grey">
              Kisi bhi level pe click karke select karein •{' '}
              {selectedPath
                ? `Selected: ${selectedPath.map((c) => c.name).join(' › ')}`
                : 'Nothing selected'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;