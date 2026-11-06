import { useEffect, useState } from 'react';

const SizeGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('women');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeCharts = {
    women: {
      headers: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
      rows: [
        ['XS', '31-32', '24-25', '34-35'],
        ['S', '33-34', '26-27', '36-37'],
        ['M', '35-36', '28-29', '38-39'],
        ['L', '37-38', '30-31', '40-41'],
        ['XL', '39-41', '32-34', '42-44'],
        ['XXL', '42-44', '35-37', '45-47'],
      ],
    },
    men: {
      headers: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
      rows: [
        ['S', '36-38', '30-32', '27'],
        ['M', '39-40', '33-34', '28'],
        ['L', '41-42', '35-36', '29'],
        ['XL', '43-44', '37-38', '30'],
        ['XXL', '45-46', '39-40', '31'],
      ],
    },
    kids: {
      headers: ['Size', 'Age', 'Height (in)', 'Chest (in)'],
      rows: [
        ['2-3Y', '2-3 years', '36-38', '21'],
        ['4-5Y', '4-5 years', '39-42', '22'],
        ['6-7Y', '6-7 years', '43-46', '24'],
        ['8-9Y', '8-9 years', '47-50', '26'],
        ['10-11Y', '10-11 years', '51-54', '28'],
      ],
    },
  };

  const tabs = [
    { key: 'women', label: 'Women' },
    { key: 'men', label: 'Men' },
    { key: 'kids', label: 'Kids' },
  ];

  const currentChart = sizeCharts[activeTab];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[100]"
        onClick={onClose}
      ></div>

      {/* Modal — Screen ke andar centered, poora scrollable */}
      <div className="fixed inset-0 z-[110] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div
            className="bg-white max-w-3xl w-full my-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-2">
                    Size Guide
                  </p>
                  <h2 className="font-heading text-xl md:text-2xl">
                    Find Your Perfect Fit
                  </h2>
                  <p className="text-xs text-brand-grey mt-1">
                    Measurements inches mein hain
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-9 h-9 flex items-center justify-center text-brand-grey hover:text-brand-black hover:bg-brand-cream transition text-xl flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 text-xs uppercase tracking-[0.2em] font-medium border-b-2 transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-brand-grey hover:text-brand-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-5 md:p-6">
              {/* Size Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-cream">
                      {currentChart.headers.map((header, i) => (
                        <th
                          key={i}
                          className="py-3 px-3 md:px-4 text-left text-[10px] uppercase tracking-widest font-medium text-brand-black"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentChart.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100"
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`py-3 px-3 md:px-4 ${
                              j === 0
                                ? 'font-heading font-bold text-brand-black text-base'
                                : 'text-brand-grey'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to Measure */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-heading text-lg mb-4">How to Measure</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      ),
                      title: 'Bust',
                      desc: 'Sab se bhari jagah par tape wrap karein, arms neeche rakhein.',
                    },
                    {
                      icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      ),
                      title: 'Waist',
                      desc: 'Kamar ki patli jagah par tape wrap karein — navel ke thora upar.',
                    },
                    {
                      icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      ),
                      title: 'Hip',
                      desc: 'Hip ki sab se bhari jagah par tape wrap karein, paon jure rakhein.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-10 h-10 bg-brand-cream flex items-center justify-center text-brand-gold flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">{item.title}</h4>
                        <p className="text-xs text-brand-grey leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="mt-8 p-4 bg-brand-cream border-l-2 border-brand-gold">
                <p className="text-xs text-brand-grey leading-relaxed">
                  <strong className="text-brand-black">Note:</strong> Agar aap do
                  sizes ke darmiyan hain, to bara size choose karein. Sab
                  measurements inches mein hain.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-brand-cream">
              <button
                onClick={onClose}
                className="w-full bg-brand-black text-white py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold transition"
              >
                Got It — Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SizeGuideModal;