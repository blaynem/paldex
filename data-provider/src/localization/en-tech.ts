import enTechNames from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_TechnologyNameText.json';
import enTechDescriptions from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_TechnologyDescText.json';

// Includes NAME_RECIPE_, DESC_RECIPE_
export const getTechStrings = (): Map<string, string> => {
  const data = new Map<string, string>();
  const textRows = Object.entries(enTechNames[0].Rows);
  const descriptionRows = Object.entries(enTechDescriptions[0].Rows);

  for (const [key, value] of textRows) {
    data.set(key, value.TextData.LocalizedString);
  }
  for (const [key, value] of descriptionRows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
