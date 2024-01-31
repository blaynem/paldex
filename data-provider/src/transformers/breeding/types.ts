export interface TransformedBreedingData {
  parent1_name: string;
  parent1_dev_name: string;
  parent2_name: string;
  parent2_dev_name: string;
  child_name: string;
  child_dev_name: string;
}
export interface TransformedUniqueBreedingData {
  unique_breeding_data: TransformedBreedingData[];
}
