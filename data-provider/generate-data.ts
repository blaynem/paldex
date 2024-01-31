import fs from 'fs';
import path from 'path';

import { create_data } from './src/data/data-provider';
import { TransformedData, transform_data } from './src/transformers';
import { GeneratedTypes } from './src/types';
import {
  SupportedLocales,
  supportedLocales,
} from './src/data/localization/types';

// Function to generate data
export const generate_data = async (
  locale: SupportedLocales
): Promise<TransformedData> => {
  const data = await create_data(locale);
  return transform_data(data);
};

// Function to write data to JSON files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const writeDataToFile = (filename: string, data: any) => {
  try {
    const dir = path.dirname(filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to ${filename}`);
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
  }
};

/**
 * Explicitly typing the data sets.
 */
interface DataSetTypes {
  'dropped_items.json': GeneratedTypes['dropped_items'];
  'elements.json': GeneratedTypes['elements'];
  'humans.json': GeneratedTypes['humans'];
  'item_details.json': GeneratedTypes['item_details'];
  'item_name_mappings.json': {
    item_to_dev_name: GeneratedTypes['item_to_dev_name'];
    dev_name_to_item: GeneratedTypes['dev_name_to_item'];
  };
  'item_recipes.json': GeneratedTypes['item_recipe_data'];
  'pals.json': GeneratedTypes['pals'];
  'unique_breeds.json': GeneratedTypes['unique_breeds'];
  'skills.json': GeneratedTypes['skills'];
  'errors.json': TransformedData['errors'];
}

// Main function to generate and write data
const main = async (locale: SupportedLocales) => {
  const { errors, elements, pals, humans, items, unique_breeds, skills } =
    await generate_data(locale);
  const {
    item_details,
    item_recipe_data,
    dropped_items,
    item_to_dev_name,
    dev_name_to_item,
  } = items;

  const datasets: DataSetTypes = {
    'dropped_items.json': dropped_items,
    'elements.json': elements,
    'humans.json': humans,
    'item_details.json': item_details,
    'skills.json': skills,
    'item_name_mappings.json': {
      item_to_dev_name,
      dev_name_to_item,
    },
    'item_recipes.json': item_recipe_data,
    'pals.json': pals,
    'unique_breeds.json': unique_breeds,
    'errors.json': errors,
  };

  for (const [filename, data] of Object.entries(datasets)) {
    writeDataToFile(`data-provider/baked-data/${locale}/${filename}`, data);
  }
};

// loop through supported locales and fire off the main function for each

// for (const locale of supportedLocales) {
// const testLocale: SupportedLocales[] = ['en'];
for (const locale of supportedLocales) {
  main(locale).catch(console.error);
}
