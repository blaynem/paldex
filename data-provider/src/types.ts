import { TransformedData } from './transformers';

export interface GeneratedTypes {
  dropped_items: TransformedData['items']['dropped_items'];
  elements: TransformedData['elements'];
  humans: TransformedData['humans'];
  item_details: TransformedData['items']['item_details'];
  item_to_dev_name: TransformedData['items']['item_to_dev_name'];
  dev_name_to_item: TransformedData['items']['dev_name_to_item'];
  item_recipe_data: TransformedData['items']['item_recipe_data'];
  pals: TransformedData['pals'];
  unique_breeds: TransformedData['unique_breeds'];
  skills: TransformedData['skills'];
}
