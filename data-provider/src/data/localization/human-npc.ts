import { SupportedLocales } from './types';
import { fetchLocaleFile } from './utils';

// Include NAME_
export const getHumanNameStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const rowData = await fetchLocaleFile(localeCode, 'HumanNameText');
  const rows = Object.entries(rowData);
  const localizedHumanNames = new Map<string, string>();

  for (const [key, values] of rows) {
    localizedHumanNames.set(key, values.TextData.LocalizedString);
  }

  return localizedHumanNames;
};

export const getUniqueNpcStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const rowData = await fetchLocaleFile(localeCode, 'UniqueNPCText');
  const rows = Object.entries(rowData);
  const localizedUniqueNpcStrings = new Map<string, string>();

  for (const [key, values] of rows) {
    localizedUniqueNpcStrings.set(key, values.TextData.LocalizedString);
  }

  return localizedUniqueNpcStrings;
};
