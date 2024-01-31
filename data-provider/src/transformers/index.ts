import { tranform_monster_data } from './pals-humans/transform-monster-human-data';
import {
  ActiveSkillsType,
  TransfomerErrorType,
  TransformedPassiveSkillsData,
} from './types';
import { DataProvider } from '../data/data-provider';
import {
  TransformedItemDetailsObject,
  transform_dropped_item_data,
  transform_item_details,
} from './items/transform-items-data';
import { transform_unique_breeding_data } from './breeding/transform-unique-breeding-data';
import { TransformedUniqueBreedingData } from './breeding/types';
import { TransformedItemDropData } from './items/types';
import { TransformedMonsterHumanData } from './pals-humans/types';
import { datakey_to_prefix } from './utils';
import { transform_skills_data } from './skills/transform-skills';

export interface TransformedData {
  elements: {
    dev_name: string;
    name: string;
  }[];
  pals: TransformedMonsterHumanData[];
  humans: TransformedMonsterHumanData[];
  items: TransformedItemDetailsObject['data'] & TransformedItemDropData;
  errors: Record<
    string,
    {
      count: number;
      errors: TransfomerErrorType[];
    }
  >;
  skills: {
    active_skills: ActiveSkillsType[];
    passive_skills: TransformedPassiveSkillsData[];
  };
  unique_breeds: TransformedUniqueBreedingData['unique_breeding_data'];
}

export const transform_data = (_data: DataProvider): TransformedData => {
  const {
    pals,
    humans: other_NPCs,
    errors: monster_data_errors,
  } = tranform_monster_data(_data);

  const { data: transformed_item_drop_data, errors: item_drop_errors } =
    transform_dropped_item_data(_data);
  transformed_item_drop_data.dropped_items;

  const { data: transformed_item_data, errors: item_detail_errors } =
    transform_item_details(_data);

  const {
    data: transformed_unique_breeding_data,
    errors: unique_breeding_errors,
  } = transform_unique_breeding_data(_data);

  const { data: transformed_skills_data, errors: skills_errors } =
    transform_skills_data(_data);

  const list_of_elements = [
    'Normal',
    'Fire',
    'Water',
    'Leaf',
    'Electricity',
    'Ice',
    'Earth',
    'Dark',
    'Dragon',
  ];

  return {
    unique_breeds: transformed_unique_breeding_data.unique_breeding_data,
    elements: list_of_elements.map((el) => ({
      name: _data.localization.keys.get(datakey_to_prefix.element + el)!,
      dev_name: el,
    })),
    pals,
    skills: transformed_skills_data,
    humans: other_NPCs,
    items: { ...transformed_item_drop_data, ...transformed_item_data },
    errors: {
      unique_breeding_errors: {
        count: unique_breeding_errors.length,
        errors: unique_breeding_errors,
      },
      monster_data_transformer: {
        count: monster_data_errors.length,
        errors: monster_data_errors,
      },
      items_data_details_transformer: {
        count: item_detail_errors.length,
        errors: item_detail_errors,
      },
      items_data_dropped_transformer: {
        count: item_drop_errors.length,
        errors: item_drop_errors,
      },
      skills_data_transformer: {
        count: skills_errors.length,
        errors: skills_errors,
      },
    },
  };
};
