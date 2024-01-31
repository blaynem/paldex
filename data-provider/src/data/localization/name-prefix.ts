import { SupportedLocales } from './types';
import { fetchLocaleFile } from './utils';

export const getNamePrefixStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'NamePrefixText');
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
