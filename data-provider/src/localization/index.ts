import { getEnUICommonStrings } from './en-ui-common';
import { getEnMonsterStrings } from './en-pal';
import { LocalizedSkillStrings, getEnSkillsStrings } from './en-skills';
import { getNamePrefixStrings } from './en-name-prefix';
import { getLocalizedPalNameStringsMap } from './en-pal-names';
import { mergeMapAndCatchDuplicates } from './utils';
import { getBuildObjectStrings } from './en-build-object';
import { getMapObjectStrings } from './en-map-object';
import { getEnItemStrings } from './en-items';
import { getEnHumanNameStrings, getEnUniqueNpcStrings } from './en-human-npc';
import { getTechStrings } from './en-tech';

export interface LocalizationData {
  en: {
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
  };
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

export const create_localization_data = (): LocalizationData => {
  return {
    en: {
      keys: mergeMapAndCatchDuplicates(
        'create_localization_data',
        getEnUICommonStrings(),
        { source: '1', map: getEnMonsterStrings() },
        { source: '2', map: getNamePrefixStrings() },
        { source: '3', map: getLocalizedPalNameStringsMap() },
        { source: '4', map: getBuildObjectStrings() },
        { source: '5', map: getMapObjectStrings() },
        { source: '6', map: getEnItemStrings() },
        { source: '7', map: getEnHumanNameStrings() },
        { source: '8', map: getEnUniqueNpcStrings() },
        { source: '9', map: getTechStrings() }
      ),
      skills: getEnSkillsStrings(),
    },
  };
};
