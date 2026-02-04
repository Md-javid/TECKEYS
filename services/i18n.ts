import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from '../locales/en.json';
import es from '../locales/es.json';
import hi from '../locales/hi.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';
import ta from '../locales/ta.json';

export const languages = {
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  hi: { name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  ta: { name: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      es: { translation: es },
      hi: { translation: hi },
      fr: { translation: fr },
      ar: { translation: ar }
    },
    fallbackLng: 'en',
    lng: localStorage.getItem('billagent_language') || 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'billagent_language'
    }
  });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  const langConfig = languages[lng as keyof typeof languages];
  if (langConfig) {
    document.documentElement.dir = langConfig.dir;
    document.documentElement.lang = lng;
  }
});

// Set initial direction
const currentLang = i18n.language as keyof typeof languages;
if (languages[currentLang]) {
  document.documentElement.dir = languages[currentLang].dir;
}

export default i18n;
