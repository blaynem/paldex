import enBuildObjectDesc from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_BuildObjectDescText.json';
import enBuildObjectDescText from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_BuildObjectCategoryText.json';
import { mergeMapAndCatchDuplicates } from './utils';

// Includes BUILDOBJECT_DESC_
export const getBuildObjectDescriptionMapStrings = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = Object.entries(enBuildObjectDesc[0].Rows);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

// Includes CATEGORY_TYPE_
export const getBuildObjectTextMapStrings = (): Map<string, string> => {
  const data = new Map<string, string>();
  const rows = Object.entries(enBuildObjectDescText[0].Rows);

  for (const [key, value] of rows) {
    data.set(key, value.TextData.LocalizedString);
  }

  return data;
};

export const getBuildObjectStrings = () =>
  mergeMapAndCatchDuplicates(
    'getBuildObjectStrings',
    getBuildObjectDescriptionMapStrings(),
    {
      source: '1',
      map: getBuildObjectTextMapStrings(),
    }
  );
