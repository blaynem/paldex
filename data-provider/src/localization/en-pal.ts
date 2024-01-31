import enPalLongDescriptionTextData from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_PalLongDescriptionText.json';
import enPalShortDescriptionTextData from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_PalShortDescriptionText.json';
import enPalSkillDescriptionTextData from '../../palworld-assets/L10N/en/Pal/DataTable/Text/DT_PalFirstActivatedInfoText.json';
import { mergeMapAndCatchDuplicates } from './utils';

const getPalSkillDescriptionMap = (): Map<string, string> => {
  const dataMap = new Map<string, string>();
  const rows = Object.entries(enPalSkillDescriptionTextData[0].Rows);

  for (const [key, value] of rows) {
    dataMap.set(key, value.TextData.LocalizedString);
  }

  return dataMap;
};

const getPalShortDescriptionMap = (): Map<string, string> => {
  const dataMap = new Map<string, string>();
  const rows = Object.entries(enPalShortDescriptionTextData[0].Rows);

  for (const [key, value] of rows) {
    dataMap.set(key, value.TextData.LocalizedString);
  }

  return dataMap;
};

const getPalLongDescriptionMap = (): Map<string, string> => {
  const dataMap = new Map<string, string>();
  const rows = Object.entries(enPalLongDescriptionTextData[0].Rows);

  for (const [key, value] of rows) {
    dataMap.set(key, value.TextData.LocalizedString);
  }

  return dataMap;
};

export const getEnMonsterStrings = () =>
  mergeMapAndCatchDuplicates(
    'getEnMonsterStrings',
    getPalLongDescriptionMap(),
    {
      source: '1',
      map: getPalShortDescriptionMap(),
    },
    {
      source: '2',
      map: getPalSkillDescriptionMap(),
    }
  );
