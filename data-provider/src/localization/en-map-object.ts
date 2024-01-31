import enMapObjectNameText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_MapObjectNameText.json';

// Includes MAPOBJECT_NAME_
export const getMapObjectNameStrings = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = Object.entries(enMapObjectNameText[0].Rows);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

export const getMapObjectStrings = () => getMapObjectNameStrings();
