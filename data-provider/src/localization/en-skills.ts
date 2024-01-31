import enSkillsNameText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_SkillNameText.json';
import enSkillsDescriptionText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_SkillDescText.json';

export interface LocalizedSkillStrings {
  localized_skill_names: Map<string, string>;
  localized_skill_descriptions: Map<string, string>;
}

const getPalSkillDescriptionMap = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = Object.entries(enSkillsDescriptionText[0].Rows);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

const getPalSkillNameMap = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = Object.entries(enSkillsNameText[0].Rows);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

export const getEnSkillsStrings = (): LocalizedSkillStrings => {
  const dataMap = {
    localized_skill_names: getPalSkillNameMap(),
    localized_skill_descriptions: getPalSkillDescriptionMap(),
  };
  return dataMap;
};
