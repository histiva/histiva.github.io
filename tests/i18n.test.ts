import { describe, it, expect } from 'vitest';
import { t, getLocaleDir, isValidLocale, withFallback } from '../src/i18n/utils';

describe('i18n utils', () => {
  it('returns translated value for known key', () => {
    expect(t('nav.product', 'en')).toBe('Product');
  });

  it('falls back to en when target locale missing key', () => {
    expect(t('nav.product', 'tr')).toBe('Product');
  });

  it('returns the key itself when missing in both target and en', () => {
    expect(t('does.not.exist', 'en')).toBe('does.not.exist');
  });

  it('returns rtl direction only for ar', () => {
    expect(getLocaleDir('ar')).toBe('rtl');
    expect(getLocaleDir('en')).toBe('ltr');
    expect(getLocaleDir('tr')).toBe('ltr');
    expect(getLocaleDir('fr')).toBe('ltr');
  });

  it('isValidLocale accepts en/tr/fr/ar and rejects others', () => {
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('ar')).toBe(true);
    expect(isValidLocale('de')).toBe(false);
    expect(isValidLocale('')).toBe(false);
  });

  it('withFallback returns true when locale has full content', () => {
    expect(withFallback('en')).toBe(false);
    expect(withFallback('tr')).toBe(true);
  });
});
