import enNamePrefix from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_NamePrefixText.json';

export const getNamePrefixStrings = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = Object.entries(enNamePrefix[0].Rows);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
