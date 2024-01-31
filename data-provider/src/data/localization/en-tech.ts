import { SupportedLocales } from './types';
import { fetchLocaleFile } from './utils';

// Includes NAME_RECIPE_, DESC_RECIPE_
export const getTechStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const textRowData = await fetchLocaleFile(localeCode, 'TechnologyNameText');
  const descRowData = await fetchLocaleFile(localeCode, 'TechnologyDescText');

  const textRows = Object.entries(textRowData);
  const descriptionRows = Object.entries(descRowData);

  for (const [key, value] of textRows) {
    data.set(key, value.TextData.LocalizedString);
  }
  for (const [key, value] of descriptionRows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
