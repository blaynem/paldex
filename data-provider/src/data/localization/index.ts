import { getUICommonStrings } from './en-ui-common';
import {
  getPalLongDescriptionTextMap,
  getPalShortDescriptionTextMap,
  getPalSkillDescriptionTextMap,
} from './en-pal';
import { LocalizedSkillStrings, getEnSkillsStrings } from './en-skills';
import { getNamePrefixStrings } from './en-name-prefix';
import { getPalNameTextStringsMap } from './en-pal-names';
import { mergeMapAndCatchDuplicates } from './utils';
import {
  getBuildObjectDescriptionTextMapStrings,
  getBuildObjectCategoryTextMapStrings,
} from './en-build-object';
import {
  getItemNameTextStrings,
  getItemDescriptionTextStrings,
} from './en-items';
import { getMapObjectNameTextStrings } from './en-map-object';
import { getHumanNameStrings, getUniqueNpcStrings } from './en-human-npc';
import { getTechStrings } from './en-tech';
import { SupportedLocales } from './types';

export interface LocalizationData {
  /**
   * Has the vast majority of the keys. Excluding skills.
   *
   * Includes keys: [
   * "ITEM_NAME_", "ITEM_DESC_", "PREFIX_NAME_", "BOSS_NAME_",
   * "GYM_NAME_", "PAL_NAME_", "PAL_LONG_DESC_", "PAL_SHORT_DESC_",
   * "PAL_FIRST_SPAWN_DESC_", "COMMON_", "BUILDOBJECT_DESC_", "CATEGORY_TYPE_",
   * "MAPOBJECT_NAME_", "NAME_", NAME_RECIPE_, DESC_RECIPE_
   * ]
   *
   * Also includes the DT_UniqueNPCText strings.
   */
  keys: Map<string, string>;
  /**
   * Skills Names icludes keys: ["PASSIVE_", "COOP_", "ACTION_SKILL_", "PARTNERSKILL_"]
   *
   * Skills Descriptions icludes keys: ["ACTION_SKILL_", "PASSIVE_"]
   */
  skills: LocalizedSkillStrings;
}

/**
 * This helpers gives us back the prefix that was stolen from us!
 * When we get the data from the L10N files, a lot of the keys have prefixes that we removed
 * in order to get certain names.
 */
export const get_prefix_for_L10N_data = () => ({
  item_names: 'ITEM_NAME_',
  item_descriptions: 'ITEM_DESC_',
});

export const create_localization_data = async (
  locale: SupportedLocales
): Promise<LocalizationData> => {
  const enUICommonStrings = await getUICommonStrings(locale);
  const namePrefixStrings = await getNamePrefixStrings(locale);
  const localizedPalNameStringsMap = await getPalNameTextStringsMap(locale);
  const buildObjectDescriptionMapStrings =
    await getBuildObjectDescriptionTextMapStrings(locale);
  const buildObjectTextMapStrings = await getBuildObjectCategoryTextMapStrings(
    locale
  );
  const mapObjectStrings = await getMapObjectNameTextStrings(locale);
  const itemNameStrings = await getItemNameTextStrings(locale);
  const itemDescriptionStrings = await getItemDescriptionTextStrings(locale);
  const enHumanNameStrings = await getHumanNameStrings(locale);
  const enUniqueNpcStrings = await getUniqueNpcStrings(locale);
  const techStrings = await getTechStrings(locale);

  const palLongDescriptionMap = await getPalLongDescriptionTextMap(locale);
  const palShortDescriptionMap = await getPalShortDescriptionTextMap(locale);
  const palSkillDescriptionMap = await getPalSkillDescriptionTextMap(locale);
  return {
    keys: mergeMapAndCatchDuplicates(
      'create_localization_data',
      enUICommonStrings,
      { source: 'namePrefixStrings', map: namePrefixStrings },
      {
        source: 'localizedPalNameStringsMap',
        map: localizedPalNameStringsMap,
      },
      {
        source: 'buildObjectDescriptionMapStrings',
        map: buildObjectDescriptionMapStrings,
      },
      { source: 'buildObjectTextMapStrings', map: buildObjectTextMapStrings },
      { source: 'mapObjectStrings', map: mapObjectStrings },
      { source: 'itemNameStrings', map: itemNameStrings },
      { source: 'itemDescriptionStrings', map: itemDescriptionStrings },
      { source: 'enHumanNameStrings', map: enHumanNameStrings },
      { source: 'enUniqueNpcStrings', map: enUniqueNpcStrings },
      { source: 'techStrings', map: techStrings },
      { source: 'palLongDescriptionMap', map: palLongDescriptionMap },
      { source: 'palShortDescriptionMap', map: palShortDescriptionMap },
      { source: 'palSkillDescriptionMap', map: palSkillDescriptionMap }
    ),
    skills: await getEnSkillsStrings(locale),
  };
};
