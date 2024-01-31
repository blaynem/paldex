import { PalItemDropData } from '../../data/pal-item-drops';
import { ActiveSkillsType } from '../skills/types';

export type PalActiveSkillsType = ActiveSkillsType & {
  level_learned: number;
};

export interface TransformedRelatedTechnologyData {
  dev_technology_name: string;
  technology_name: string;
  description: string;
}

export interface TransformedMonsterHumanData {
  /**
   * These are skill unlocks or something.
   */
  related_technology: TransformedRelatedTechnologyData | null;
  /**
   * There are 3 fields we need to consider when putting some data in:
   * OverrideNameTextID, NamePrefixID, OverridePartnerSkillTextID
   */
  pal_name: string;
  pal_description: string;
  /**
   * Defaults to "Missing..." if cannot be found.
   *
   * Note: This data is not relevant to humans.
   */
  partner_skill_title: string;
  /**
   * This is the name of the pal in development, not the translated name.
   */
  pal_dev_name: string;
  /**
   * If true, the most of the data should be available.
   * If false, then some data may be missing from the monster.
   * Currently, we consider a monster to be missing if the pal_name is `en_text` which is a placeholder.
   */
  is_available_ingame: boolean;
  /**
   * Whether or not this entry is a pal.
   */
  is_pal: boolean;
  /**
   * Defaults to "Missing..." if cannot be found.
   *
   * Note: This data is not relevant to humans.
   */
  partner_skill_description: string;
  elements: string[];
  item_drops: PalItemDropData[];
  passive_skills: string[];
  active_skills: ActiveSkillsType[];
  rarity: number;
  work_suitability: {
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
  stats: {
    hp: number;
    melee_attack: number;
    shot_attack: number;
    defense: number;
    support: number;
    size: string;
    walk_speed: number;
    run_speed: number;
    ride_sprint_speed: number;
    transport_speed: number;
    max_full_stomach: number;
    full_stomach_decrease_rate: number;
    food_amount: number;
    viewing_distance: number;
    viewing_angle: number;
    hearing_rate: number;
    stamina: number;
  };
  male_probability: number;
  combi_rank: number;
  noose_trap: boolean;
  nocturnal: boolean;
  biological_grade: number;
  predator: boolean;
  edible: boolean;
  battle_bgm: string;
  is_boss: boolean;
  is_tower_boss: boolean;
  craft_speed: number;
  capture_rate_correct: number;
  experience_ratio: number;
  price: number;
  genus_category: string;
  organization: string;
  can_equip_weapon: boolean;
  ai_response: string;
  ai_sight_response: string;
  /**
   * This is the index in the monster book, however it's a bit wonky.
   * Some monsters have a suffix, which is a letter at the end of the index.
   * Some monsters have a negative index, which is a monster that is not in the monster book.
   */
  pal_index: string;
}
