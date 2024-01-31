import enCommonUiText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_UI_Common_Text.json';

export const getEnUICommonStrings = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = enCommonUiText[0].Rows;

  for (const [key, value] of Object.entries(rows)) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};
