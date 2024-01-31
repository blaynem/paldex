import * as fs from 'fs/promises'; // Using fs promises for asynchronous operations
import { create_data } from './src/data/data-provider';
import { TransformedData, transform_data } from './src/transformers';
import { GeneratedTypes } from './src/types';

// Function to generate data
export const generate_data = (): TransformedData => {
  const data = create_data();
  return transform_data(data);
};

// Function to write data to JSON files
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const writeDataToFile = async (filename: string, data: any) => {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Data written to ${filename}`);
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
  }
};

/**
 * Explicitly typing the data sets.
 */
interface DataSetTypes {
  'data-provider/baked-data/dropped_items.json': GeneratedTypes['dropped_items'];
  'data-provider/baked-data/elements.json': GeneratedTypes['elements'];
  'data-provider/baked-data/humans.json': GeneratedTypes['humans'];
  'data-provider/baked-data/item_details.json': GeneratedTypes['item_details'];
  'data-provider/baked-data/item_name_mappings.json': {
    item_to_dev_name: GeneratedTypes['item_to_dev_name'];
    dev_name_to_item: GeneratedTypes['dev_name_to_item'];
  };
  'data-provider/baked-data/item_recipes.json': GeneratedTypes['item_recipe_data'];
  'data-provider/baked-data/pals.json': GeneratedTypes['pals'];
  'data-provider/baked-data/unique_breeds.json': GeneratedTypes['unique_breeds'];
  'data-provider/baked-data/skills.json': GeneratedTypes['skills'];
  'data-provider/errors.json': TransformedData['errors'];
}

// Main function to generate and write data
const main = async () => {
  const { errors, elements, pals, humans, items, unique_breeds, skills } =
    generate_data();
  const {
    item_details,
    item_recipe_data,
    dropped_items,
    item_to_dev_name,
    dev_name_to_item,
  } = items;

  const datasets: DataSetTypes = {
    'data-provider/baked-data/dropped_items.json': dropped_items,
    'data-provider/baked-data/elements.json': elements,
    'data-provider/baked-data/humans.json': humans,
    'data-provider/baked-data/item_details.json': item_details,
    'data-provider/baked-data/skills.json': skills,
    'data-provider/baked-data/item_name_mappings.json': {
      item_to_dev_name,
      dev_name_to_item,
    },
    'data-provider/baked-data/item_recipes.json': item_recipe_data,
    'data-provider/baked-data/pals.json': pals,
    'data-provider/baked-data/unique_breeds.json': unique_breeds,
    'data-provider/errors.json': errors,
  };

  for (const [filename, data] of Object.entries(datasets)) {
    await writeDataToFile(filename, data);
  }
};

main().catch(console.error);
