import en from '../i18n/en/translation.json';
import hi from '../i18n/hi/translation.json';
import bn from '../i18n/bn/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
} as const;

export default resources;