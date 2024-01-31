import { SupportedLocales } from './types';
import { fetchLocaleFile } from './utils';

export const getUICommonStrings = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'UICommonText');

  for (const [key, value] of Object.entries(rowData)) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
