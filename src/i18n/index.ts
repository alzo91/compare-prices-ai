import { getLocales, useLocales, type Locale } from 'expo-localization';
import i18n from 'i18next';
import { useEffect } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';

import type { Language, LanguagePreference } from '@/models/Settings';

import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

export const DEFAULT_LANGUAGE: Language = 'pt-BR';
export const SUPPORTED_LANGUAGES: readonly Language[] = ['pt-BR', 'en-US'];

export const resources = {
  'pt-BR': { translation: ptBR },
  'en-US': { translation: enUS },
} as const;

// Maps one device locale to a supported language by its language code
// (pt-PT → pt-BR, en-GB → en-US). Returns undefined for anything else.
function matchLocale(locale: Pick<Locale, 'languageCode'>): Language | undefined {
  switch (locale.languageCode?.toLowerCase()) {
    case 'pt':
      return 'pt-BR';
    case 'en':
      return 'en-US';
    default:
      return undefined;
  }
}

// First device locale (in user preference order) we support; pt-BR otherwise.
export function resolveLanguage(locales: Pick<Locale, 'languageCode'>[] = getLocales()): Language {
  for (const locale of locales) {
    const language = matchLocale(locale);
    if (language) return language;
  }
  return DEFAULT_LANGUAGE;
}

export function getLanguage(): Language {
  const current = i18n.resolvedLanguage ?? i18n.language;
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(current)
    ? (current as Language)
    : DEFAULT_LANGUAGE;
}

export function setLanguage(language: Language): void {
  if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }
}

// Resources are bundled, so init runs synchronously and `t` is ready on first render.
void i18n.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  defaultNS: 'translation',
  initAsync: false,
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
});

// Language to show for the "Idioma" setting: a fixed choice wins; 'device' (or anything unknown,
// e.g. older or corrupt stored data) follows the device locales.
export function resolveActiveLanguage(
  preference: LanguagePreference | undefined,
  locales: Pick<Locale, 'languageCode'>[] = getLocales(),
): Language {
  if (preference && (SUPPORTED_LANGUAGES as readonly string[]).includes(preference)) {
    return preference as Language;
  }
  return resolveLanguage(locales);
}

// Applies the "Idioma" preference; mounted once at the root layout. On 'device' it also follows
// device language changes while the app runs (Android can change it without a restart).
// i18n.changeLanguage re-renders every useTranslation() consumer, so screens, tab labels and
// titles switch live, without a restart.
export function useAppLanguage(preference: LanguagePreference): void {
  const locales = useLocales();
  const language = resolveActiveLanguage(preference, locales);
  useEffect(() => {
    setLanguage(language);
  }, [language]);
}

// Usage: `const { t }= useI18n(); t('home.title')` — keys are type-checked (see i18next.d.ts).
export const useI18n = useTranslation;

// Outside React (e.g. in a container callback): `t('common.close')`.
export const t = i18n.t.bind(i18n);

export default i18n;
