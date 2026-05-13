import en from './en.json' assert { type: 'json' };
import tr from './tr.json' assert { type: 'json' };
import fr from './fr.json' assert { type: 'json' };
import ar from './ar.json' assert { type: 'json' };

export const LOCALES = ['en', 'tr', 'fr', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const dicts: Record<Locale, Record<string, unknown>> = { en, tr, fr, ar };

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getLocaleDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** True if the locale falls back to EN content (i.e., not fully translated yet). */
export function withFallback(locale: Locale): boolean {
  return locale !== DEFAULT_LOCALE && Object.keys(dicts[locale]).length === 0;
}

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function t(key: string, locale: Locale): string {
  const fromLocale = getNested(dicts[locale], key);
  if (typeof fromLocale === 'string') return fromLocale;
  const fromEn = getNested(dicts[DEFAULT_LOCALE], key);
  if (typeof fromEn === 'string') return fromEn;
  return key;
}

/** Build a localized URL path; EN returns `/path`, others return `/{locale}/path`. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === '/' ? '/' : clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}
