import { fetchLocaleFile } from './utils';
import { SupportedLocales } from './types';

export const getItemNameTextStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const rowData = await fetchLocaleFile(localeCode, 'ItemNameText');
  const rows = Object.entries(rowData);
  const localizedItemNameStrings = new Map<string, string>();

  for (const [key, values] of rows) {
    localizedItemNameStrings.set(key, values.TextData.LocalizedString);
  }

  return localizedItemNameStrings;
};

export const getItemDescriptionTextStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const rowData = await fetchLocaleFile(localeCode, 'ItemDescriptionText');
  const rows = Object.entries(rowData);
  const localizedItemDescriptionStrings = new Map<string, string>();

  for (const [key, values] of rows) {
    localizedItemDescriptionStrings.set(key, values.TextData.LocalizedString);
  }

  return localizedItemDescriptionStrings;
};
