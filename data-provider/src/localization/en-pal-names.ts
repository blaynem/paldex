import enPalNameTextData from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_PalNameText.json';

export const getLocalizedPalNameStringsMap = (): Map<string, string> => {
  const dataMap = new Map<string, string>();
  const rows = Object.entries(enPalNameTextData[0].Rows);

  for (const [key, value] of rows) {
    dataMap.set(key, value.TextData.LocalizedString);
  }

  return dataMap;
};
