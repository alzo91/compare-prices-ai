import enUS from '@/i18n/locales/en-US.json';
import ptBR from '@/i18n/locales/pt-BR.json';

import { resolveAppVersion, UNKNOWN_VERSION } from '../about.version';

describe('resolveAppVersion', () => {
  it('returns the configured version', () => {
    expect(resolveAppVersion('1.0.0')).toBe('1.0.0');
  });

  it('trims whitespace', () => {
    expect(resolveAppVersion(' 1.2 ')).toBe('1.2');
  });

  it.each([undefined, null, '', '  '])('falls back when version is %p', (value) => {
    expect(resolveAppVersion(value)).toBe(UNKNOWN_VERSION);
  });
});

describe('about i18n', () => {
  it('has the version label with placeholder in both languages', () => {
    expect(ptBR.about.version).toBe('versão {{version}}');
    expect(enUS.about.version).toContain('{{version}}');
  });
});
