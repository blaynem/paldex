export interface TransformedDroppedItemData {
  droppers: { name: string; dev_name: string }[];
  item_name: string;
  item_description: string;
  item_dev_name: string;
}

export interface TransformedItemRecipes {
  dev_name: string;
  name: string;
  description: string;
  creates_amount: number;
  work_required: number;
  unlocked_by_item: {
    dev_name: string;
    name: string;
  } | null;
  required_materials: {
    dev_name: string;
    name: string;
    amount: number;
  }[];
}
/**
 * Super useful for filtering by item type.
 * Ex: is_weapon, is_armor, etc.
 */
export interface ItemTypeType {
  weapon_type?: string;
  armor_slot?: string;
  consumable_type?: string;
  material_type?: string;
  food_type?: string;
  essential_type?: string;
  is_ammo?: boolean;
  is_accessory?: boolean;
  is_blueprint?: boolean;
  /**
   * Is only for `MonsterEquipWeapon_Dummy`, not sure what that is.
   */
  is_monster_equip_weapon?: boolean;
}
export interface TransformedItemDetails {
  item_name: string;
  item_description: string;
  item_dev_name: string;
  icon_name: string;
  type: ItemTypeType;
  rank: number;
  rarity: number;
  max_stack_count: number;
  weight: number;
  price: number;
  consumed_on_use: boolean;
  item_static_class: string;
  restore_effects: {
    restore_satiety: number;
    restore_concentration: number;
    restore_sanity: number;
    restore_health: number;
  } | null;
  durability: number;
  magazine_size: number;
  sneak_attack_rate: number;
  physical_attack_value: number;
  physical_defense_value: number;
  hp_value: number;
  shield_value: number;
  magic_attack_value: number;
  magic_defense_value: number;
  status_effects: {
    effect_time: number;
    effects: {
      effect_type: string;
      effect_value: number;
    }[];
  } | null;
  passive_skill: {
    passive_skill_dev_name: string;
    passive_skill_name: string;
    passive_skill_description: string;
  } | null;
  active_skill: {
    active_skill_dev_name: string;
    active_skill_name: string;
    active_skill_description: string;
  } | null;
  corruption_factor: number;
}

export interface TransformedItemDropData {
  /**
   * A list of all dropped items and things that drop them.
   */
  dropped_items: TransformedDroppedItemData[];
}
