import { SupportedLocales } from './types';
import { fetchLocaleFile } from './utils';

// Includes BUILDOBJECT_DESC_
export const getBuildObjectDescriptionTextMapStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'BuildObjectDescText');
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

// Includes CATEGORY_TYPE_
export const getBuildObjectCategoryTextMapStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'BuildObjectCategoryText');
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
