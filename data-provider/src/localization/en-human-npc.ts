import enHumanNamesText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_HumanNameText.json';
import enUniqueNpcText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_UniqueNPCText.json';

// Include NAME_
export const getEnHumanNameStrings = () => {
  const rows = enHumanNamesText[0].Rows;
  const localizedHumanNames = new Map<string, string>();

  for (const [key, values] of Object.entries(rows)) {
    localizedHumanNames.set(key, values.TextData.LocalizedString);
  }

  return localizedHumanNames;
};

export const getEnUniqueNpcStrings = () => {
  const rows = enUniqueNpcText[0].Rows;
  const localizedUniqueNpcStrings = new Map<string, string>();

  for (const [key, values] of Object.entries(rows)) {
    localizedUniqueNpcStrings.set(key, values.TextData.LocalizedString);
  }

  return localizedUniqueNpcStrings;
};
