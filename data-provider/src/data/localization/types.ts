export const supportedLocales = [
  'de',
  'en',
  'es',
  'fr',
  'it',
  'ko',
  'pt-BR',
  'ru',
  'zh-Hans',
  'zh-Hant',
] as const;

export type SupportedLocales = (typeof supportedLocales)[number];

// All Localization tables have the same structure.
export interface TableRow {
  TextData: {
    Namespace: string;
    Key: string;
    SourceString: string;
    LocalizedString: string;
  };
}
