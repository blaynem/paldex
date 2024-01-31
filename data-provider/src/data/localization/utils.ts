import { SupportedLocales, TableRow } from './types';

/**
 * Method to merge all the maps and alert us if there are any duplicate keys.
 */
export const mergeMapAndCatchDuplicates = (
  /**
   * Used to determine which map the duplicate key came from.
   */
  call_source: string,
  first_map: Map<string, string>,
  ...maps: { source: string; map: Map<string, string> }[]
): Map<string, string> => {
  const mergedMap = new Map<string, string>(first_map);

  for (const { source, map } of maps) {
    for (const [key, value] of map) {
      if (mergedMap.has(key)) {
        console.error(
          `Duplicate key found in ${call_source}. Key: ${key}, Source: ${source}`
        );
      }
      mergedMap.set(key, value);
    }
  }

  return mergedMap;
};

// Define your localeToInterface data (without types)
export const localeToInterface = {
  BuildObjectCategoryText: 'DT_BuildObjectCategoryText',
  BuildObjectDescText: 'DT_BuildObjectDescText',
  DungeonNameText: 'DT_DungeonNameText',
  HelpGuideDescText: 'DT_HelpGuideDescText',
  HumanNameText: 'DT_HumanNameText',
  ItemDescriptionText: 'DT_ItemDescriptionText',
  ItemNameText: 'DT_ItemNameText',
  MapObjectNameText: 'DT_MapObjectNameText',
  MapRespawnPointInfoText: 'DT_MapRespawnPointInfoText',
  NamePrefixText: 'DT_NamePrefixText',
  NoteDescText: 'DT_NoteDescText',
  NpcTalkText: 'DT_NpcTalkText',
  PalFirstActivatedInfoText: 'DT_PalFirstActivatedInfoText',
  PalLongDescriptionText: 'DT_PalLongDescriptionText',
  PalNameText: 'DT_PalNameText',
  PalShortDescriptionText: 'DT_PalShortDescriptionText',
  SkillDescText: 'DT_SkillDescText',
  SkillNameText: 'DT_SkillNameText',
  TechnologyDescText: 'DT_TechnologyDescText',
  TechnologyNameText: 'DT_TechnologyNameText',
  TutorialMessageText: 'DT_TutorialMessageText',
  UICommonText: 'DT_UI_Common_Text',
  UniqueNPCText: 'DT_UniqueNPCText',
  WorldMapCommonText: 'DT_WorldMapCommonText',
};

// Define the fetchLocaleFile function
export const fetchLocaleFile = async (
  locale: SupportedLocales,
  data_key: keyof typeof localeToInterface
): Promise<Record<string, TableRow>> => {
  try {
    const _fileKey = localeToInterface[data_key];
    const { default: data } = await import(
      `../../../palworld-assets/L10N/${locale}/Pal/DataTable/Text/${_fileKey}.json`
    );
    return data[0].Rows;
  } catch (error) {
    console.error(
      `Failed to load localized data for locale ${locale} and data key ${data_key}:`,
      error
    );
    return {};
  }
};
