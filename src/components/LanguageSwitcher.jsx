import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-[10px] uppercase tracking-widest font-medium transition ${
          i18n.language === 'en'
            ? 'bg-brand-black text-white'
            : 'text-brand-grey hover:text-brand-black'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ur')}
        className={`px-2 py-1 text-[10px] uppercase tracking-widest font-medium transition ${
          i18n.language === 'ur'
            ? 'bg-brand-black text-white'
            : 'text-brand-grey hover:text-brand-black'
        }`}
      >
        اردو
      </button>
    </div>
  );
};

export default LanguageSwitcher;