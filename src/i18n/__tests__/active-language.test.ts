import { resolveActiveLanguage } from '@/i18n';
import type { LanguagePreference } from '@/models/Settings';

const pt = [{ languageCode: 'pt' }];
const en = [{ languageCode: 'en' }];
const fr = [{ languageCode: 'fr' }];

describe('resolveActiveLanguage (preference → active language)', () => {
  it('follows the device on "device"', () => {
    expect(resolveActiveLanguage('device', pt)).toBe('pt-BR');
    expect(resolveActiveLanguage('device', en)).toBe('en-US');
  });

  it('uses the first supported device locale, pt-BR when none is supported', () => {
    expect(resolveActiveLanguage('device', [...fr, ...en])).toBe('en-US');
    expect(resolveActiveLanguage('device', fr)).toBe('pt-BR');
    expect(resolveActiveLanguage('device', [])).toBe('pt-BR');
  });

  it('a fixed choice wins over the device locale', () => {
    expect(resolveActiveLanguage('pt-BR', en)).toBe('pt-BR');
    expect(resolveActiveLanguage('en-US', pt)).toBe('en-US');
  });

  it('treats a missing or unknown preference (older / corrupt data) as "device"', () => {
    expect(resolveActiveLanguage(undefined, en)).toBe('en-US');
    expect(resolveActiveLanguage('es-ES' as LanguagePreference, en)).toBe('en-US');
  });
});
