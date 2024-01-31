import { DataProvider } from '../../data/data-provider';
import { get_localized_character_name } from '../pals-humans/utils';
import { TransfomerErrorType } from '../types';
import {
  filterOutTestKeys,
  datakey_to_prefix,
  parseAndReplaceAttributes,
} from '../utils';
import {
  TransformedItemRecipes,
  TransformedItemDetails,
  TransformedItemDropData,
  TransformedDroppedItemData,
} from './types';
import { determine_item_types, getFoodStatusEffectData } from './utils';

export interface TransformedItemDetailsObject {
  data: {
    /**
     * The recipes for each item.
     */
    item_recipe_data: Record<string, TransformedItemRecipes>;
    /**
     * A more detailed list of the specific items and its data.
     */
    item_details: Record<string, TransformedItemDetails>;
    /**
     * A map of the item names to its dev name.
     */
    item_to_dev_name: Record<string, string>;
    /**
     * A map of the items dev names to the item names.
     */
    dev_name_to_item: Record<string, string>;
  };
  errors: TransfomerErrorType[];
}

export const transform_item_details = (
  _data: DataProvider
): TransformedItemDetailsObject => {
  const errors: TransfomerErrorType[] = [];
  const logErrorFn = (error: TransfomerErrorType) => {
    errors.push(error);
  };
  const transformedData: Record<string, TransformedItemDetails> = {};

  const item_to_dev_name: Record<string, string> = {};
  const dev_name_to_item: Record<string, string> = {};

  const item_details_data = _data.item_data.item_data;
  for (const [dev_item_name, item_data] of item_details_data) {
    if (
      filterOutTestKeys(dev_item_name) ||
      dev_item_name.includes('_NPC') ||
      dev_item_name.includes('PV_') ||
      dev_item_name.includes('MonsterEquipWeapon_Dummy') ||
      dev_item_name.includes('AirGrapplingGun') ||
      dev_item_name.includes('Blueprint_Head002_5')
    ) {
      continue;
    }

    // There may be an override for data names.
    const item_name_key = item_data.override_name
      ? item_data.override_name
      : datakey_to_prefix.item_name + dev_item_name;

    // TODO: We may have to strip the names of things like NPC
    //      We need to just use the override name if there is one instead.
    // TODO: Filter out test items including `_Debug`
    const localized_item_name = _data.localization.keys.get(item_name_key);
    if (!localized_item_name) {
      logErrorFn({
        transformer: 'transform_item_details',
        description: `Could not get translated item name: ${dev_item_name}`,
        data: {
          dev_item_name,
          key: item_name_key,
          has_override: item_data.override_name !== null,
        },
      });
      continue;
    }

    item_to_dev_name[localized_item_name] = dev_item_name;
    dev_name_to_item[dev_item_name] = localized_item_name;

    const description_key = item_data.override_description
      ? item_data.override_description
      : datakey_to_prefix.item_description + dev_item_name;
    const localized_item_description =
      _data.localization.keys.get(description_key);
    if (
      !localized_item_description &&
      !description_key.includes('Temperature')
    ) {
      logErrorFn({
        transformer: 'transform_item_details',
        description: `Could not get translated item description: ${dev_item_name}`,
        data: {
          dev_item_name,
          key: description_key,
          has_override: item_data.override_description !== null,
        },
      });
      continue;
    }

    // Passive Skills
    let passive_skill = null;
    if (item_data.passive_skill_name !== 'None') {
      const passive_skill_name =
        _data.localization.skills.localized_skill_names.get(
          datakey_to_prefix.skills_passive + item_data.passive_skill_name
        );
      if (!passive_skill_name) {
        logErrorFn({
          transformer: 'transform_item_details',
          description: `Could not get translated passive skill name: ${item_data.passive_skill_name}`,
          data: {
            dev_item_name,
            key:
              datakey_to_prefix.skills_passive + item_data.passive_skill_name,
          },
        });
      }

      let passive_skill_description =
        _data.localization.skills.localized_skill_descriptions.get(
          datakey_to_prefix.skills_passive + item_data.passive_skill_name
        );
      // Sometimes the skill name might require `_PAL` appended to it.
      if (!passive_skill_description) {
        passive_skill_description =
          _data.localization.skills.localized_skill_descriptions.get(
            datakey_to_prefix.skills_passive +
              item_data.passive_skill_name +
              '_PAL'
          );
      }
      if (
        !passive_skill_description &&
        !item_data.passive_skill_name.includes('Temperature') &&
        // All of the element resist are missing descriptions. Though we have a hack for the `1` level by adding `_PAL` to the end.
        !item_data.passive_skill_name.includes('ElementResist') &&
        !item_data.passive_skill_name.includes('ACC_') // ex: PASSIVE_Attack_ACC_up2 - There is no description for this.
      ) {
        logErrorFn({
          transformer: 'transform_item_details',
          description: `Could not get translated passive skill description: ${item_data.passive_skill_name}`,
          data: {
            note: 'Many of these are missing in our data',
            dev_item_name,
            key:
              datakey_to_prefix.skills_passive + item_data.passive_skill_name,
          },
        });
      }
      passive_skill = {
        passive_skill_dev_name: item_data.passive_skill_name,
        passive_skill_name: passive_skill_name ?? 'Missing...',
        passive_skill_description: passive_skill_description ?? 'Missing...',
      };
    }

    // Active Skills
    const active_skill = null;
    if (item_data.waza_id !== 'None') {
      const skill_data = _data.skills_data.active.get(item_data.waza_id);
      if (!skill_data) {
        logErrorFn({
          transformer: 'transform_item_details',
          description: `Could not find skill data for skill: ${item_data.waza_id}`,
          data: {
            dev_item_name,
            skill: item_data.waza_id,
          },
        });
        continue;
      }

      const localized_name =
        _data.localization.skills.localized_skill_names.get(
          datakey_to_prefix.skills_action + item_data.waza_id
        );
      if (!localized_name) {
        logErrorFn({
          transformer: 'transform_item_details',
          description: `Could not find localized name for skill: ${
            datakey_to_prefix.skills_action + item_data.waza_id
          }`,
          data: {
            dev_item_name,
            skill_dev_name: item_data.waza_id,
            data_key: datakey_to_prefix.skills_action,
          },
        });
      }

      const localized_description =
        _data.localization.skills.localized_skill_descriptions.get(
          datakey_to_prefix.skills_action + item_data.waza_id
        );
      if (!localized_description) {
        logErrorFn({
          transformer: 'transform_item_details',
          description: `Could not find localized description for skill: ${
            datakey_to_prefix.skills_action + item_data.waza_id
          }`,
          data: {
            dev_item_name,
            skill_dev_name: item_data.waza_id,
            data_key: datakey_to_prefix.skills_action,
          },
        });
      }
    }

    let restore_effects: {
      restore_satiety: number;
      restore_concentration: number;
      restore_sanity: number;
      restore_health: number;
    } | null = {
      restore_satiety: item_data.restore_satiety,
      restore_concentration: item_data.restore_concentration,
      restore_sanity: item_data.restore_sanity,
      restore_health: item_data.restore_health,
    };
    if (
      restore_effects.restore_satiety === 0 &&
      restore_effects.restore_concentration === 0 &&
      restore_effects.restore_sanity === 0 &&
      restore_effects.restore_health === 0
    ) {
      restore_effects = null;
    }

    const data: TransformedItemDetails = {
      status_effects: getFoodStatusEffectData(
        _data,
        item_data,
        dev_item_name,
        logErrorFn
      ),
      item_name: parseAndReplaceAttributes(
        _data,
        'transform_item_details',
        localized_item_name ?? 'Missing...',
        logErrorFn
      ),
      item_description: parseAndReplaceAttributes(
        _data,
        'transform_item_details',
        localized_item_description ?? 'Missing...',
        logErrorFn
      ),
      item_dev_name: dev_item_name,
      icon_name: item_data.icon_name,
      type: determine_item_types(item_data),
      rank: item_data.rank,
      rarity: item_data.rarity,
      max_stack_count: item_data.max_stack_count,
      weight: item_data.weight,
      price: item_data.price,
      consumed_on_use: item_data.b_not_consumed,
      item_static_class: item_data.item_static_class,
      restore_effects,
      durability: item_data.durability,
      magazine_size: item_data.magazine_size,
      sneak_attack_rate: item_data.sneak_attack_rate,
      physical_attack_value: item_data.physical_attack_value,
      physical_defense_value: item_data.physical_defense_value,
      hp_value: item_data.hp_value,
      shield_value: item_data.shield_value,
      magic_attack_value: item_data.magic_attack_value,
      magic_defense_value: item_data.magic_defense_value,
      passive_skill: passive_skill,
      active_skill: active_skill,
      corruption_factor: item_data.corruption_factor,
    };

    // TODO: We should loop through a bunch of the keys and
    // remove them if they are nullish. Helps reduce json size.

    transformedData[dev_item_name] = data;
  }
  const item_recipe_data = transform_item_recipes(_data, logErrorFn);
  return {
    data: {
      item_details: transformedData,
      item_to_dev_name,
      dev_name_to_item,
      item_recipe_data,
    },
    errors,
  };
};

export const transform_item_recipes = (
  _data: DataProvider,
  logErrorFn: (error: TransfomerErrorType) => void
): Record<string, TransformedItemRecipes> => {
  const transformedData: Record<string, TransformedItemRecipes> = {};

  for (const [dev_recipe_name, recipe_data] of _data.item_data.recipe_data) {
    let localized_recipe_name = _data.localization.keys.get(
      datakey_to_prefix.recipe_name + dev_recipe_name
    );
    if (!localized_recipe_name) {
      localized_recipe_name = _data.localization.keys.get(
        datakey_to_prefix.recipe_name + dev_recipe_name.toUpperCase() // Some of them are uppercase
      );
    }
    // Attempt to fallback to an item name if it's not found.
    if (!localized_recipe_name) {
      localized_recipe_name = _data.localization.keys.get(
        datakey_to_prefix.item_name + dev_recipe_name
      );
    }
    if (!localized_recipe_name) {
      logErrorFn({
        transformer: 'transform_item_recipes',
        description: `Could not get translated recipe name: ${dev_recipe_name}`,
        data: {
          dev_item_name: dev_recipe_name,
          key: datakey_to_prefix.recipe_name + dev_recipe_name,
        },
      });
    }

    let localized_recipe_description = _data.localization.keys.get(
      datakey_to_prefix.recipe_description + dev_recipe_name
    );
    // This is basically undefined if it's the same as that key.
    // Though when we include translations, this "en Text" needs to be changed.
    if (localized_recipe_description === 'en Text') {
      localized_recipe_description = undefined;
    }
    // Check again with uppercase, Some of them are uppercase
    if (!localized_recipe_description) {
      localized_recipe_description = _data.localization.keys.get(
        datakey_to_prefix.recipe_description + dev_recipe_name.toUpperCase()
      );
    }
    // Attempt to fallback to an item description if it's not found.
    if (!localized_recipe_description) {
      localized_recipe_description = _data.localization.keys.get(
        datakey_to_prefix.item_description + dev_recipe_name
      );
    }
    if (!localized_recipe_description) {
      logErrorFn({
        transformer: 'transform_item_recipes',
        description: `Could not get translated recipe description: ${dev_recipe_name}`,
        data: {
          dev_item_name: dev_recipe_name,
          key: datakey_to_prefix.recipe_description,
        },
      });
    }

    let unlocked_by_item_name = null;
    // If it's actually unlocked by something
    if (recipe_data.unlock_item_id) {
      unlocked_by_item_name = _data.localization.keys.get(
        datakey_to_prefix.item_name + recipe_data.unlock_item_id
      );
      if (!unlocked_by_item_name) {
        logErrorFn({
          transformer: 'transform_item_recipes',
          description: `Could not get translated unlock item name: ${recipe_data.unlock_item_id}`,
          data: {
            dev_item_name: dev_recipe_name,
            key: datakey_to_prefix.item_name + dev_recipe_name,
          },
        });
      }
    }

    const required_materials = recipe_data.required_materials.map(
      (material) => {
        const material_name = _data.localization.keys.get(
          datakey_to_prefix.item_name + material.material_id
        );
        if (!material_name) {
          logErrorFn({
            transformer: 'transform_item_recipes',
            description: `Could not get translated material name: ${material.material_id}`,
            data: {
              dev_item_name: dev_recipe_name,
              key: datakey_to_prefix.item_name + material.material_id,
            },
          });
        }
        return {
          dev_name: material.material_id,
          name: material_name ?? 'Missing...',
          amount: material.material_count,
        };
      }
    );

    const data: TransformedItemRecipes = {
      dev_name: dev_recipe_name,
      description: parseAndReplaceAttributes(
        _data,
        'transform_item_recipes',
        localized_recipe_description ?? 'Missing...',
        logErrorFn
      ),
      name: parseAndReplaceAttributes(
        _data,
        'transform_item_recipes',
        localized_recipe_name ?? 'Missing...',
        logErrorFn
      ),
      creates_amount: recipe_data.product_count,
      work_required: recipe_data.work_amount,
      unlocked_by_item: recipe_data.unlock_item_id
        ? {
            dev_name: recipe_data.unlock_item_id,
            name: unlocked_by_item_name ?? 'Missing...',
          }
        : null,
      required_materials: required_materials,
    };
    transformedData[dev_recipe_name] = data;
  }
  return transformedData;
};

export const transform_dropped_item_data = (
  _data: DataProvider
): { data: TransformedItemDropData; errors: TransfomerErrorType[] } => {
  const errors: TransfomerErrorType[] = [];
  const logErrorFn = (error: TransfomerErrorType) => {
    errors.push(error);
  };
  /**
   * This is an array of all items and things that drop them.
   */
  const dropped_items_map = new Map<
    string,
    {
      dev_dropper_name: string;
      dropper_name: string;
    }[]
  >();

  for (const [dropper_name, item_drops] of _data.item_data.pal_item_drops) {
    if (filterOutTestKeys(dropper_name)) {
      continue;
    }
    const localized_names = get_localized_character_name(
      _data,
      dropper_name,
      logErrorFn
    );
    const item_dropper_obj = {
      dev_dropper_name: dropper_name,
      dropper_name: localized_names.localized_name_without_weapon,
    };

    // Loop through all the items that the dropper drops, and add them to the item_map.
    for (const item_drop of item_drops) {
      if (!dropped_items_map.has(item_drop.item_name)) {
        dropped_items_map.set(item_drop.item_name, [item_dropper_obj]);
      } else {
        // We know this is safe because we just checked if it has the key.
        dropped_items_map.get(item_drop.item_name)!.push(item_dropper_obj);
      }
    }
  }

  const dropped_items: TransformedDroppedItemData[] = [];
  for (const [dev_item_name] of dropped_items_map) {
    if (filterOutTestKeys(dev_item_name)) {
      continue;
    }
    const localized_item_name = _data.localization.keys.get(
      datakey_to_prefix.item_name + dev_item_name
    );
    const localized_item_description = _data.localization.keys.get(
      datakey_to_prefix.item_description + dev_item_name
    );
    if (!localized_item_name) {
      errors.push({
        transformer: 'transform_pal_item_drop_data',
        description: `Could not get translated item name: ${dev_item_name}`,
        data: { dev_item_name },
      });
      continue;
    }
    if (!localized_item_description) {
      errors.push({
        transformer: 'transform_pal_item_drop_data',
        description: `Could not get translated item description: ${dev_item_name}`,
        data: { dev_item_name },
      });
      continue;
    }

    const item: TransformedDroppedItemData = {
      item_name: localized_item_name,
      item_description: parseAndReplaceAttributes(
        _data,
        'transform_item_data',
        localized_item_description,
        logErrorFn
      ),
      item_dev_name: dev_item_name,
      droppers: dropped_items_map.get(dev_item_name)!.map((dropper) => ({
        name: dropper.dropper_name,
        dev_name: dropper.dev_dropper_name,
      })),
    };
    dropped_items.push(item);
  }

  return {
    data: {
      dropped_items: dropped_items,
    },
    errors,
  };
};
