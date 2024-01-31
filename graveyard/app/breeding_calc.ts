import { TransformedData } from "@/data-provider/transformers";
import uniqueBreedsData from "./data/unique_breeds.json";
import palsData from "./data/pals.json";
// - Include breeding calculator
//   - This seems to be where the `b` comes from in the id.
//   - Someone did the work: https://old.reddit.com/r/Palworld/comments/19d98ws/spreadsheet_all_breeding_combinations_datamined/
//     - breeding power = `CombiRank`
//     - power level calc = (parent 1 `combiRank` + parent 2 `combiRank`) / 2
//     - Gender Probability is `MaleProbability`
//       - There would also be a way to search all the uniques
//       -Gender doesn't matter so long as you have one male and one female to start the breeding process.
//       -However, the odds of a Pal being male or female differs between some of the Pals. All Pals have a 50% (equal) chance to be male or female, with the exception of ones where their MaleProbability is not 50/50.
//     - Unique pal combinations are inside `DT_PalCombiUnique.json`
//     - We should likely give them a view where they can search / dropdown the pal list and just
//       have a `{pal} x {pal}` and it will show the results below. And you can include the power level for cal.
// Outside of unique breeding pairs, The 'tie breaker' (since 1015 is equal distance between 1010 and 1020)
// just comes down to the which Pal comes first in the game file's index.
// Power levels can be found on the "Visual Data" tab of the sheet

// That way if we ever get a match between breeding pairs, we can show them the correct one.
type UniqueBreedingData = TransformedData["unique_breeds"];

const uniqueBreedingData: UniqueBreedingData = uniqueBreedsData;

type PalData = {
  name: string;
  dev_name: string;
  combiRank: number;
  maleProbability: number;
  index: string;
};

type BreedingResult = {
  powerLevel: number;
  maleProbability: number;
  uniqueCombination: boolean;
  name: string;
  dev_name: string;
  index: string;
};

function closestToTargetNumber(
  pal1: PalData,
  pal2: PalData,
  target: number
): PalData {
  const diff1 = Math.abs(pal1.combiRank - target);
  const diff2 = Math.abs(pal2.combiRank - target);

  if (diff1 < diff2) {
    return pal1;
  } else {
    return pal2;
  }
}

const findPalDataFromName = (name: string): PalData => {
  let pal = palsData.find((pal) => pal.pal_name === name);

  if (pal) {
    return {
      combiRank: pal.combi_rank,
      dev_name: pal.pal_dev_name,
      index: pal.pal_index,
      maleProbability: pal.male_probability,
      name: pal.pal_name,
    };
  }

  throw new Error(`Could not find pal with name ${name}`);
};
const determineBreedName = (
  parent1: PalData,
  parent2: PalData,
  childsPowerLevel: number
): PalData => {
  // If the parents are the same, just return the name of the parent.
  if (parent1.name === parent2.name) {
    return parent1;
  }
  // If there is a tie, it will pick the Pal with the earliest index.
  if (parent1.combiRank === parent2.combiRank) {
    return parent1.index < parent2.index ? parent1 : parent2;
  }

  // Otherwise the game will then pick the Pal with the closest power to that childs powerLevel.
  return closestToTargetNumber(parent1, parent2, childsPowerLevel);
};

export const calculateBreedingResult = (
  parent1: string,
  parent2: string
): BreedingResult => {
  let parent1Data = findPalDataFromName(parent1);
  let parent2Data = findPalDataFromName(parent2);
  let childPowerLevel = (parent1Data.combiRank + parent2Data.combiRank) / 2;

  const uniquePair = uniqueBreedingData.find((uniquePair) => {
    return (
      (uniquePair.parent1_name === parent1Data.name &&
        uniquePair.parent2_name === parent2Data.name) ||
      (uniquePair.parent1_name === parent2Data.name &&
        uniquePair.parent2_name === parent1Data.name)
    );
  });

  let breedData = determineBreedName(parent1Data, parent2Data, childPowerLevel);

  if (uniquePair) {
    // Find the child in the monster data
    // Set the breedData to that child
    const child = palsData.find(
      (pal) => pal.pal_name === uniquePair.child_name
    );
    if (child) {
      const childData: PalData = {
        name: child.pal_name,
        dev_name: child.pal_dev_name,
        combiRank: child.combi_rank,
        maleProbability: child.male_probability,
        index: child.pal_index,
      };
      breedData = childData;
    }
  }

  const result: BreedingResult = {
    name: breedData.name,
    dev_name: breedData.dev_name,
    powerLevel: childPowerLevel,
    uniqueCombination: !!uniquePair,
    maleProbability: breedData.maleProbability,
    index: breedData.index,
  };

  return result;
};
