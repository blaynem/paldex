import { fetchLocaleFile } from './utils';
import { SupportedLocales } from './types';

export const getPalSkillDescriptionTextMap = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const dataMap = new Map<string, string>();
  const rowData = await fetchLocaleFile(
    localeCode,
    'PalFirstActivatedInfoText'
  );
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    dataMap.set(key, value.TextData.LocalizedString);
  }

  return dataMap;
};

export const getPalLongDescriptionTextMap = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const dataMap = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'PalLongDescriptionText');
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    dataMap.set(key, value.TextData.LocalizedString);
  }

  return dataMap;
};
