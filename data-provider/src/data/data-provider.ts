import { ItemDropsData, create_pal_item_drops_data } from './pal-item-drops';
import {
  MonsterHumanData,
  create_monster_human_data,
} from './monster-human-data';
import { UniqueBreedingData, getUniqueBreedingData } from './breeding-data';
import {
  ActiveSkillsDataType,
  PassiveSkillsDataType,
  getActiveSkillsData,
  getPassiveSkillsData,
} from './skills-data';
import { ItemDataAndRecipesType, getItemData } from './item-data';
import { LocalizationData, create_localization_data } from './localization';
import { SupportedLocales } from './localization/types';

export interface DataProvider {
  breeding_data: Map<string, UniqueBreedingData>;
  localization: LocalizationData;
  monster_human_data: Map<string, MonsterHumanData>;
  item_data: {
    food_status_effects: ItemDataAndRecipesType['food_status_effects'];
    pal_item_drops: ItemDropsData['pal_item_drops'];
    item_to_droppers: ItemDropsData['item_to_droppers'];
    recipe_data: ItemDataAndRecipesType['recipe_data'];
    item_data: ItemDataAndRecipesType['item_data'];
  };
  skills_data: {
    active: Map<string, ActiveSkillsDataType>;
    passive: Map<string, PassiveSkillsDataType>;
  };
}

export const create_data = async (
  locale: SupportedLocales
): Promise<DataProvider> => {
  const { pal_item_drops, item_to_droppers } = create_pal_item_drops_data();
  const { recipe_data, item_data, food_status_effects } = getItemData();
  const localization = await create_localization_data(locale);
  return {
    breeding_data: getUniqueBreedingData(),
    localization,
    monster_human_data: create_monster_human_data(),
    item_data: {
      food_status_effects,
      pal_item_drops,
      item_to_droppers,
      recipe_data,
      item_data,
    },
    skills_data: {
      active: getActiveSkillsData(),
      passive: getPassiveSkillsData(),
    },
  };
};
