import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { PalBarProps } from "@/components/PalBar";
import humansData from "@/app/data/humans.json";
import palsData from "@/app/data/pals.json";
import uniqueBreedsData from "@/app/data/unique_breeds.json";
import itemsData from "@/app/data/item_details.json";
import droppedItems from "@/app/data/dropped_items.json";
import itemNameMappings from "@/app/data/item_name_mappings.json";
import itemRecipes from "@/app/data/item_recipes.json";
import { PalType, Pals_Type } from "@/types/types";
import icons from "@/assets/images/pal_icons";
import images from "@/assets/images/pal_images";
import inGameIcons from "@/assets/images/in_game_icons";
import itemIcons from "@/assets/images/item_icons";
import menuIcons from "@/assets/images/menu_icons";
import {
  TransformedDroppedItemData,
  TransformedItemDetails,
  TransformedItemRecipes,
} from "@/data-provider/transformers/types";
import { GeneratedTypes } from "@/data-provider/types";

/**
 * Give text a little more room to breathe by adding another new line if there is already one.
 */
export const addNewLine = (text: string) => {
  return text.replace("\n", "\n\n");
};

/**
 * Removes a new line if there is one, helps to keep the text from being too spaced out.
 */
export const removeNewLine = (text: string) => {
  return text.replace("\r\n", " ");
};

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
export function FontAwesomeIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export function getPalsForPalList(): PalBarProps[] {
  return palsData.map((pal) => {
    return {
      pal: {
        ...pal,
        pal_type: pal.elements.map((type) => type.toUpperCase() as PalType),
        partner_skill: {
          id: "0",
          description: pal.partner_skill_description,
          title: pal.partner_skill_title,
        },
        active_skills: pal.active_skills,
        pal_stats: pal.stats,
      },
      image: getPalIconSource(pal.pal_dev_name),
    };
  });
}

export function getHumans(): GeneratedTypes["humans"] {
  return humansData;
}

export function getPals(): Pals_Type[] {
  return palsData
    .map((pal) => {
      // change this later when we get  better data
      return {
        ...pal,
        pal_type: mapPalType(pal.elements),
        partner_skill: {
          id: "0",
          description: pal.partner_skill_description,
          title: pal.partner_skill_title,
        },
        active_skills: pal.active_skills,
        pal_stats: pal.stats,
        image_path: getPalIconSource(pal.pal_dev_name),
      };
    })
    .filter((pal) => pal.pal_index != "-1" && pal.pal_index != "-2");
}
export function getPalById(id: string): Pals_Type | null {
  let pal = getPals().find((pal) => pal.pal_index == id);
  if (pal) {
    return pal;
  }
  return null;
}

export function mapPalType(pal_types: string[]): PalType[] {
  return pal_types.map((type) => type.toUpperCase() as PalType);
}

export function getImageSource(pal_name: string) {
  let palNameForImage = pal_name.replace(" ", "").toLowerCase();
  const imageSrc = (images as any)[palNameForImage];
  return imageSrc;
}

export function getPalIconSource(pal_dev_name: string) {
  const imageSrc = (icons as any)[pal_dev_name];
  return imageSrc;
}

// Caching this one since we convert it to a map.
let cachedGetItems: Map<string, TransformedItemDetails> | null = null;
export function getItems(): Map<string, TransformedItemDetails> {
  if (cachedGetItems) {
    return cachedGetItems;
  }
  let itemsMap = new Map<string, TransformedItemDetails>();

  const typedItemsData = itemsData as GeneratedTypes["item_details"];

  for (let key in typedItemsData) {
    const itemDetail = typedItemsData[key];
    if (itemDetail) {
      itemsMap.set(key, itemDetail);
    }
  }

  cachedGetItems = itemsMap;
  return itemsMap;
}

export const getItemData = (item_dev_name: string): TransformedItemDetails => {
  const typedItemsData = itemsData as GeneratedTypes["item_details"];
  return typedItemsData[item_dev_name];
};

export const getItemDroppers = (
  item_dev_name: string
): TransformedDroppedItemData["droppers"] => {
  let item = (droppedItems as GeneratedTypes["dropped_items"]).find(
    (item) => item.item_dev_name == item_dev_name
  );
  if (item) {
    return item.droppers;
  }
  return [];
};

export function getItemNameFromDevName(item_dev_name: string): string {
  let item = (
    itemNameMappings.dev_name_to_item as GeneratedTypes["dev_name_to_item"]
  )[item_dev_name];
  if (item) {
    return item;
  }
  return "";
}

export function getItemDevNameFromName(item_name: string): string {
  let item = (
    itemNameMappings.item_to_dev_name as GeneratedTypes["item_to_dev_name"]
  )[item_name];
  if (item) {
    return item;
  }
  return "";
}

export function getWorkSuitabilityName(work_suitability: string) {
  const translate = {
    emit_flame: "Kindling",
    watering: "Watering",
    seeding: "Planting",
    collection: "Gathering",
    deforest: "Lumbering",
    mining: "Mining",
    cool: "Cooling",
    monster_farm: "Farming",
    product_medicine: "Medicine Prod.",
    transport: "Transporting",
    generate_electricity: "Electricity",
    handcraft: "Handiwork",
    oil_extraction: "Oil Extraction",
  };

  return (translate as any)[work_suitability];
}

export function getItemIconSource(item_name: string) {
  const itemNameForImage = item_name.replace("-", "").toLowerCase();

  if (itemNameForImage.includes("blueprint")) {
    return (itemIcons as any)["blueprint"];
  }
  const imageSrc = (itemIcons as any)[itemNameForImage];

  return imageSrc;
}

export function getMenuIconSource(menu_name: keyof typeof menuIcons) {
  const imageSrc = (menuIcons as any)[menu_name];
  return imageSrc;
}

export function getItemByDevName(
  item_dev_name: string
): TransformedItemDetails | null {
  const items = getItems();
  const item = items.get(item_dev_name);
  if (item) {
    return item;
  }
  return null;
}

export function getItemByName(
  item_name: string
): TransformedItemDetails | null {
  const items = getItems();
  const dev_item_name = getItemDevNameFromName(item_name);
  if (!dev_item_name) {
    return null;
  }

  const item = items.get(dev_item_name);
  if (item) {
    return item;
  }
  return null;
}

export function getWorkSuitabilityIcon(work_suitability: string) {
  const imageSrc = (inGameIcons as any)[work_suitability];
  return imageSrc;
}

/**
 * Getter to return the dev name for pals that require certain circumstances to be bred
 */
export function getDevNameForUniqueBreeds(): string[] {
  return uniqueBreedsData.map((pal) => pal.child_dev_name);
}

/**
 * Getter to return the dev name for pals that require certain circumstances to be bred.
 * @param _item_name - The item to get the recipe for
 */
export function getRecipeForItem(
  _item_name: string
): TransformedItemRecipes | null {
  const recipe = (itemRecipes as any)[_item_name];
  if (recipe) {
    return recipe;
  }
  return null;
}

type RecipeItem = {
  item_name: string; // Name of the recipe that requires the target item
  item_dev_name: string; // Development name of the recipe
  quantity: number; // Quantity of the target item required in the recipe
};

export function getRecipesThatRequireItem(item_dev_name: string): RecipeItem[] {
  let itemsThatRequireItem: RecipeItem[] = [];
  for (let key in itemRecipes) {
    const recipe = itemRecipes[key as keyof typeof itemRecipes];
    if (recipe) {
      const recipeItems = recipe.required_materials;
      const recipeItem = recipeItems.find(
        (rItem) => rItem.dev_name === item_dev_name
      );
      if (recipeItem) {
        itemsThatRequireItem.push({
          item_name: recipe.name, // Name of the recipe
          item_dev_name: recipe.dev_name, // Development name of the recipe
          quantity: recipeItem.amount, // Quantity of the target item required
        });
      }
    }
  }
  return itemsThatRequireItem.filter(
    (item) => item.item_name.toLowerCase() !== "en text"
  );
}
