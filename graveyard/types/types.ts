import { ActiveSkillsType, TransformedMonsterHumanData } from "@/data-provider/transformers/types";

export const Elements = {
  NEUTRAL: "NEUTRAL",
  GRASS: "GRASS",
  FIRE: "FIRE",
  WATER: "WATER",
  ELECTRIC: "ELECTRIC",
  ICE: "ICE",
  GROUND: "GROUND",
  DARK: "DARK",
  DRAGON: "DRAGON",
} as const;

export type PalType = (typeof Elements)[keyof typeof Elements];

export type Pals_Type = {
  pal_dev_name: string;
  pal_index: string;
  pal_name: string;
  partner_skill: PalPartnerSkill_Type;
  pal_type: PalType[];
  item_drops: TransformedMonsterHumanData["item_drops"];
  work_suitability: PalWorkSuitability_Type;
  pal_description: string;
  pal_stats: TransformedMonsterHumanData["stats"];
  active_skills: ActiveSkillsType[];
  rarity: number;
  nocturnal: boolean;
  related_technology: TransformedMonsterHumanData["related_technology"]
};

type Item_Drop_Type = {
  drop_rate: number;
  min_drop: number;
  max_drop: number;
  item_name: string;
};

export type Item_Type = {
  item_dev_name: string;
  item_name: string;
  item_description: string;
  droppers: Dropper_Type[];
};

type Dropper_Type = {
  name: string;
  dev_name: string;
};

export type Pals_Basic_Type = Pick<
  Pals_Type,
  "pal_index" | "pal_name" | "pal_type" | "pal_dev_name"
>;

export type PalPartnerSkill_Type = {
  id: string;
  title: string;
  description: string;
};


export type PalPassiveSkills_Type = {
  id: string;
  title: string;
  description: string;
  modifier_values: string;
};

export type PalStats_Type = {
  health: string;
  hunger: string;
  sanity: string;
  melee_attack: string;
  ranged_attack: string;
  defense: string;
  work_speed: string;
  food_required: number;
};

export type PalWorkSuitabilityNames =
  | "Kindling"
  | "Watering"
  | "Planting"
  | "Generating Electricity"
  | "Handiwork"
  | "Gathering"
  | "Lumbering"
  | "Mining"
  | "Medicine Production"
  | "Cooling"
  | "Transporting"
  | "Farming";

export type PalWorkSuitability_Type = {
  emit_flame: number;
  watering: number;
  seeding: number;
  generate_electricity: number;
  handcraft: number;
  collection: number;
  deforest: number;
  mining: number;
  oil_extraction: number;
  product_medicine: number;
  cool: number;
  transport: number;
  monster_farm: number;
};

// possible drops
// pals hunger is the orange thing
// san = sanity? like they go crazy cuz they get overworked
// passive skills what does the red / white arrow.
