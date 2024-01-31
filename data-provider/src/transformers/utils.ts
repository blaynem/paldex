import { DataProvider } from '../data/data-provider';
import { TransfomerErrorType } from './types';

export const filterOutTestKeys = (name: string): boolean => {
  const test_names = [
    'TestAssassin',
    'TestNPC',
    'PlantSlime_Flower',
    'BlueprintTest',
  ].map((v) => v.toLowerCase());

  return test_names.includes(name.toLowerCase());
};

/**
 * Essentially an enum to map to the correct prefix for the data key.
 */
export const datakey_to_prefix = {
  item_name: 'ITEM_NAME_',
  item_name_blueprint: 'ITEM_NAME_Blueprint_',
  item_description: 'ITEM_DESC_',
  prefix_name: 'PREFIX_NAME_',
  boss_name: 'BOSS_NAME_',
  gym_name: 'GYM_NAME_',
  pal_name: 'PAL_NAME_',
  skills_passive: 'PASSIVE_',
  skills_coop: 'COOP_',
  skills_action: 'ACTION_SKILL_',
  skills_partnerskill: 'PARTNERSKILL_',
  pal_long_description: 'PAL_LONG_DESC_',
  map_object_name: 'MAPOBJECT_NAME_',
  recipe_name: 'NAME_RECIPE_',
  recipe_description: 'DESC_RECIPE_',
  skill_unlock_desc: 'DESC_RECIPE_SkillUnlock_',
  skill_unlock_name: 'NAME_RECIPE_SkillUnlock_',
  skill_unlock: 'SkillUnlock_',
  element: 'COMMON_ELEMENT_NAME_',
};

/**
 * This helper parses out the attributes from the the input string.
 * Specifically for and pal_description, partner_skill_description to replace the `<attribute id=|123|/>` with the actual attribute.
 */
export const extractAttributes = (
  input: string
): (string | { key: string; id: string })[] => {
  const regex = /<(\w+) id=\|([^|]+)\|\/>/g;
  let match;
  const result: (string | { key: string; id: string })[] = [];

  let lastIndex = 0;
  while ((match = regex.exec(input)) !== null) {
    const [, key, id] = match;
    if (lastIndex !== match.index) {
      result.push(input.slice(lastIndex, match.index));
    }
    result.push({ key, id });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    result.push(input.slice(lastIndex));
  }

  return result;
};

interface KeyMapType {
  uiCommon: (val: string) => string | { error: string };
  itemName: (val: string) => string | { error: string };
  mapObjectName: (val: string) => string | { error: string };
  activeSkillName: (val: string) => string | { error: string };
  characterName: (val: string) => string | { error: string };
}

/**
 * Helper function to parse and replace attributes in a string. Used mainly for the
 * `partner_skill_title` and `partner_skill_description`
 */
export const parseAndReplaceAttributes = (
  _data: DataProvider,
  /**
   * Which transformer is calling this function. Used for logging purposes.
   */
  transformer: string,
  input_string: string,
  if_error_fn: (error: TransfomerErrorType) => void
): string => {
  // The parts will come back as either an array of strings or objects.
  // We need to loop through and replace the objects with the correct value.
  // And finally join the array back into a string.
  const parts = extractAttributes(input_string).map((part) => {
    if (typeof part !== 'string') {
      const { key, id } = part;
      // Get the correct function to use.
      const keyMap: KeyMapType = {
        // Needs to be grabbed from localization.en.keys
        uiCommon: (val) =>
          _data.localization.keys.get(val) || {
            error: '{ui-common-missing}',
          },
        // TODO: Need to implement item getter.
        itemName: (val) => {
          let item_name_check = _data.localization.keys.get(
            datakey_to_prefix.item_name + val
          );
          // If it's not the item_name, it could be from the recipe_name
          if (!item_name_check) {
            item_name_check = _data.localization.keys.get(
              datakey_to_prefix.recipe_name + val
            );
          }
          // It could also potentially be a blueprint name!
          if (!item_name_check) {
            item_name_check = _data.localization.keys.get(
              datakey_to_prefix.item_name_blueprint + val
            );
          }

          return (
            item_name_check || {
              error: '{item-name-missing}',
            }
          );
        },
        mapObjectName: (val) =>
          _data.localization.keys.get(
            datakey_to_prefix.map_object_name + val
          ) || { error: '{map-object-missing}' },
        activeSkillName: (val) =>
          _data.localization.skills.localized_skill_names.get(
            datakey_to_prefix.skills_action + val // Add correct prefix
          ) || { error: '{active-skill-missing}' },
        characterName: (val) =>
          _data.localization.keys.get(datakey_to_prefix.pal_name + val) || {
            error: '{character-name-missing}',
          },
      };
      // Fire the function
      const fn = keyMap[key as keyof KeyMapType];
      if (!fn) {
        if_error_fn({
          transformer: `${transformer} -- parseAndReplaceAttributes`,
          description: 'Failed to get fn',
          data: {
            key,
            id,
          },
        });
      }
      const result = fn(id);
      if (typeof result === 'object' && 'error' in result) {
        if_error_fn({
          transformer: `${transformer} -- parseAndReplaceAttributes`,
          description: 'Failed to get result',
          data: {
            key,
            id,
            result,
          },
        });
        return result.error;
      }
      if (
        result.includes('<') &&
        result.includes('>') &&
        result.includes('|')
      ) {
        if_error_fn({
          transformer: `${transformer} -- parseAndReplaceAttributes`,
          description: 'Failed to correctly parse result',
          data: {
            key,
            id,
            result,
          },
        });
      }
      return result;
    }
    return part;
  });

  return parts.join('').replace('\r\n', ' ');
};
