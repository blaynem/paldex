import enItemNamesText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_ItemNameText.json';
import enItemDescriptionsText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_ItemDescriptionText.json';
import { mergeMapAndCatchDuplicates } from './utils';

type LocalizedItemNameStrings = Map<string, string>;
export const getEnItemNameStrings = () => {
  const rows = enItemNamesText[0].Rows;
  const localizedItemNameStrings: LocalizedItemNameStrings = new Map();

  for (const [key, values] of Object.entries(rows)) {
    localizedItemNameStrings.set(key, values.TextData.LocalizedString);
  }

  return localizedItemNameStrings;
};

type LocalizedItemDescriptionStrings = Map<string, string>;
export const getEnItemDescriptionStrings = () => {
  const rows = enItemDescriptionsText[0].Rows;
  const localizedItemDescriptionStrings: LocalizedItemDescriptionStrings =
    new Map();

  for (const [key, values] of Object.entries(rows)) {
    localizedItemDescriptionStrings.set(key, values.TextData.LocalizedString);
  }

  return localizedItemDescriptionStrings;
};

export const getEnItemStrings = () => {
  const localizedItemNameStrings = getEnItemNameStrings();
  const localizedItemDescriptionStrings = getEnItemDescriptionStrings();

  return mergeMapAndCatchDuplicates(
    'getEnItemStrings',
    localizedItemNameStrings,
    {
      source: '1',
      map: localizedItemDescriptionStrings,
    }
  );
};
