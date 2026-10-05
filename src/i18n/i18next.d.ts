import 'i18next';

import type ptBR from './locales/pt-BR.json';

// pt-BR is the source of truth for keys: a missing key in en-US.json is a review issue,
// a key missing in pt-BR.json is a type error at the call site.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof ptBR;
    };
    returnNull: false;
  }
}
