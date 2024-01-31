import uniqueBreedingCombinations from '../../palworld-assets/DataTable/Character/DT_PalCombiUnique.json';

export interface UniqueBreedingData {
  parent1: string;
  parent2: string;
  child: string;
}
export const getUniqueBreedingData = (): Map<string, UniqueBreedingData> => {
  const rows = Object.entries(uniqueBreedingCombinations[0].Rows);

  const dataMap = new Map<string, UniqueBreedingData>();
  for (const [key, value] of rows) {
    dataMap.set(key, {
      parent1: value.ParentTribeA.replace('EPalTribeID::', ''),
      parent2: value.ParentTribeB.replace('EPalTribeID::', ''),
      child: value.ChildCharacterID,
    });
  }

  return dataMap;
};
