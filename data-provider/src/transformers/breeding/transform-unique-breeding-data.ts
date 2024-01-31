import { DataProvider } from '../../data/data-provider';
import { TransfomerErrorType } from '../types';
import { datakey_to_prefix } from '../utils';
import {
  TransformedUniqueBreedingData,
  TransformedBreedingData,
} from './types';

export const transform_unique_breeding_data = (
  _data: DataProvider
): { data: TransformedUniqueBreedingData; errors: TransfomerErrorType[] } => {
  const errors: TransfomerErrorType[] = [];
  const logErrorFn = (error: TransfomerErrorType) => {
    errors.push(error);
  };

  const localized_search = (dev_name: string) => {
    const localized_name = _data.localization.keys.get(
      datakey_to_prefix.pal_name + dev_name
    );

    if (!localized_name) {
      logErrorFn({
        transformer: 'transform_pal_item_drop_data',
        description: `Could not get translated pal name: ${dev_name}`,
        data: {
          dev_name,
          localization_key: datakey_to_prefix.pal_name + dev_name,
        },
      });

      return 'Missing...';
    }

    return localized_name;
  };

  const unique_breeding_data: TransformedBreedingData[] = [];
  for (const [, breeding_data] of _data.breeding_data) {
    unique_breeding_data.push({
      parent1_name: localized_search(breeding_data.parent1),
      parent1_dev_name: breeding_data.parent1,
      parent2_name: localized_search(breeding_data.parent2),
      parent2_dev_name: breeding_data.parent2,
      child_name: localized_search(breeding_data.child),
      child_dev_name: breeding_data.child,
    });
  }

  return {
    data: {
      unique_breeding_data,
    },
    errors,
  };
};
