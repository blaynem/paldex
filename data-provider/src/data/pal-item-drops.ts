import item_drop_data from '../../palworld-assets/DataTable/Character/DT_PalDropItem.json';

export interface PalItemDropData {
  drop_rate: number;
  min_drop: number;
  max_drop: number;
  item_name: string;
}

interface pal_item_drops_type {
  CharacterID: string;
  Level: number;
  ItemId1: string;
  Rate1: number;
  min1: number;
  Max1: number;
  ItemId2: string;
  Rate2: number;
  min2: number;
  Max2: number;
  ItemId3: string;
  Rate3: number;
  min3: number;
  Max3: number;
  ItemId4: string;
  Rate4: number;
  min4: number;
  Max4: number;
  ItemId5: string;
  Rate5: number;
  min5: number;
  Max5: number;
}

export const get_item_to_droppers = (
  _data: ItemDropsData['pal_item_drops']
): ItemDropsData['item_to_droppers'] => {
  const item_map = new Map<string, string[]>();

  for (const [monster_name, items] of _data) {
    for (const item of items) {
      if (!item_map.has(item.item_name)) {
        item_map.set(item.item_name, [monster_name]);
      } else {
        item_map.set(item.item_name, [
          ...item_map.get(item.item_name)!,
          monster_name,
        ]);
      }
    }
  }

  return item_map;
};

export interface ItemDropsData {
  /**
   * A map of things to the items they drop.
   */
  pal_item_drops: Map<string, PalItemDropData[]>;
  /**
   * A map of item keys to the things that drop them.
   */
  item_to_droppers: Map<string, string[]>;
}

/**
 * Returns a list of items dropped by pals.
 */
export const create_pal_item_drops_data = (): ItemDropsData => {
  const rows = Object.entries(item_drop_data[0].Rows);

  const pal_item_drops = new Map<string, PalItemDropData[]>();

  for (const [, value] of rows) {
    const itemDropDataArray: PalItemDropData[] = [];

    for (let i = 1; i <= 5; i++) {
      const itemDropData: PalItemDropData = {
        drop_rate: value[`Rate${i}` as keyof pal_item_drops_type] as number,
        min_drop: value[`min${i}` as keyof pal_item_drops_type] as number,
        max_drop: value[`Max${i}` as keyof pal_item_drops_type] as number,
        item_name: value[`ItemId${i}` as keyof pal_item_drops_type] as string,
      };

      if (itemDropData.drop_rate > 0) {
        itemDropDataArray.push(itemDropData);
      }
    }

    pal_item_drops.set(value.CharacterID, itemDropDataArray);
  }

  return {
    pal_item_drops,
    item_to_droppers: get_item_to_droppers(pal_item_drops),
  };
};
