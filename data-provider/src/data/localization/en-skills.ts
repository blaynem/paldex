import { SupportedLocales } from './types';
import { fetchLocaleFile } from './utils';

export interface LocalizedSkillStrings {
  localized_skill_names: Map<string, string>;
  localized_skill_descriptions: Map<string, string>;
}

const getSkillNameTextMap = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'SkillNameText');
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

const getPalSkillDescriptionTextMap = async (
  localeCode: SupportedLocales
): Promise<Map<string, string>> => {
  const data = new Map<string, string>();
  const rowData = await fetchLocaleFile(localeCode, 'SkillDescText');
  const rows = Object.entries(rowData);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

/**
 * This has a few clashing names, so they need to be split up correctly.
 */
export const getEnSkillsStrings = async (
  localeCode: SupportedLocales
): Promise<LocalizedSkillStrings> => ({
  localized_skill_descriptions: await getPalSkillDescriptionTextMap(localeCode),
  localized_skill_names: await getSkillNameTextMap(localeCode),
});
