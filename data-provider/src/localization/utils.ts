/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Method to merge all the maps and alert us if there are any duplicate keys.
 */
export const mergeMapAndCatchDuplicates = (
  /**
   * Used to determine which map the duplicate key came from.
   */
  call_source: string,
  first_map: Map<string, any>,
  ...maps: { source: string; map: Map<string, any> }[]
): Map<string, string> => {
  const mergedMap = new Map<string, string>(first_map);

  for (const { source, map } of maps) {
    for (const [key, value] of map) {
      if (mergedMap.has(key)) {
        console.error(
          `Duplicate key found in ${call_source}. Key: ${key}, Source: ${source}`
        );
      }
      mergedMap.set(key, value);
    }
  }

  return mergedMap;
};
