import item_recipe from '../../palworld-assets/DataTable/Item/DT_ItemRecipeDataTable.json';
import item_data_table from '../../palworld-assets/DataTable/Item/DT_ItemDataTable.json';
import foodStatusEffects from '../../palworld-assets/DataTable/Item/DT_StatusEffectFood.json';

export interface FoodStatusEffectType {
  effect_time: number;
  effects: {
    effect_type: string;
    effect_value: number;
  }[];
}

export interface ItemRecipeType {
  product_id: string;
  product_count: number;
  work_amount: number;
  workable_attribute: number;
  unlock_item_id: string | null;
  required_materials: {
    material_id: string;
    material_count: number;
  }[];
  energy_type: string;
  energy_amount: number;
  editor_row_name_hash: number;
}

export interface ItemDetailsTypes {
  override_name: string | null;
  override_description: string | null;
  icon_name: string;
  type_a: string;
  type_b: string;
  rank: number;
  rarity: number;
  max_stack_count: number;
  weight: number;
  price: number;
  sort_id: number;
  b_in_treasure_box: boolean;
  b_not_consumed: boolean;
  b_enable_handcraft: boolean;
  technology_tree_lock: number;
  item_static_class: string;
  item_dynamic_class: string;
  item_actor_class: string;
  item_static_mesh_name: string;
  visual_blueprint_class_name: string;
  drop_item_type: string;
  editor_row_name_hash: number;
  restore_satiety: number;
  restore_concentration: number;
  restore_sanity: number;
  restore_health: number;
  grant_effects: {
    effect_id: number;
    effect_time: number;
  }[];
  durability: number;
  element_type: string;
  b_sleep_weapon: boolean;
  magazine_size: number;
  sneak_attack_rate: number;
  physical_attack_value: number;
  hp_value: number;
  physical_defense_value: number;
  shield_value: number;
  magic_attack_value: number;
  magic_defense_value: number;
  passive_skill_name: string;
  waza_id: string;
  corruption_factor: number;
  float_value1: number;
}

export interface ItemDataAndRecipesType {
  item_data: Map<string, ItemDetailsTypes>;
  recipe_data: Map<string, ItemRecipeType>;
  food_status_effects: Map<string, FoodStatusEffectType>;
}

export const getFoodStatusEffectData = (): Map<
  string,
  FoodStatusEffectType
> => {
  const statusEffects = Object.entries(foodStatusEffects[0].Rows);
  const statusEffectMap = new Map<string, FoodStatusEffectType>();
  for (const [key, value] of statusEffects) {
    statusEffectMap.set(key, {
      effect_time: value.effectTime,
      effects: [
        {
          effect_type: value.EffectType1.replace(
            'EPalFoodStatusEffectType::',
            ''
          ),
          effect_value: value.EffectValue1,
        },
        {
          effect_type: value.EffectType2.replace(
            'EPalFoodStatusEffectType::',
            ''
          ),
          effect_value: value.EffectValue2,
        },
      ].filter((effect) => effect.effect_type !== 'None'),
    });
  }
  return statusEffectMap;
};

export const getItemData = (): ItemDataAndRecipesType => {
  const itemTableRows = Object.entries(item_data_table[0].Rows);
  const itemRecipeRows = Object.entries(item_recipe[0].Rows);

  const itemDataTableMap = new Map<string, ItemDetailsTypes>();
  for (const [key, value] of itemTableRows) {
    itemDataTableMap.set(key, {
      override_name: value.OverrideName !== 'None' ? value.OverrideName : null,
      override_description:
        value.OverrideDescription !== 'None' ? value.OverrideDescription : null,
      icon_name: value.IconName,
      type_a: value.TypeA.replace('EPalItemTypeA::', ''),
      type_b: value.TypeB.replace('EPalItemTypeB::', ''),
      rank: value.Rank,
      rarity: value.Rarity,
      max_stack_count: value.MaxStackCount,
      weight: value.Weight,
      price: value.Price,
      sort_id: value.SortID,
      b_in_treasure_box: value.bInTreasureBox,
      b_not_consumed: value.bNotConsumed,
      b_enable_handcraft: value.bEnableHandcraft,
      technology_tree_lock: value.TechnologyTreeLock,
      item_static_class: value.ItemStaticClass,
      item_dynamic_class: value.ItemDynamicClass,
      item_actor_class: value.ItemActorClass,
      item_static_mesh_name: value.ItemStaticMeshName,
      visual_blueprint_class_name: value.VisualBlueprintClassName,
      drop_item_type: value.DropItemType.replace('EPalDropItemType::', ''),
      editor_row_name_hash: value.Editor_RowNameHash,
      restore_satiety: value.RestoreSatiety,
      restore_concentration: value.RestoreConcentration,
      restore_sanity: value.RestoreSanity,
      restore_health: value.RestoreHealth,
      grant_effects: [
        {
          effect_id: value.GrantEffect1Id,
          effect_time: value.GrantEffect1Time,
        },
        {
          effect_id: value.GrantEffect2Id,
          effect_time: value.GrantEffect2Time,
        },
        {
          effect_id: value.GrantEffect3Id,
          effect_time: value.GrantEffect3Time,
        },
      ],
      durability: value.Durability,
      element_type: value.ElementType.replace('EPalElementType::', ''),
      b_sleep_weapon: value.bSleepWeapon,
      magazine_size: value.MagazineSize,
      sneak_attack_rate: value.SneakAttackRate,
      physical_attack_value: value.PhysicalAttackValue,
      hp_value: value.HPValue,
      physical_defense_value: value.PhysicalDefenseValue,
      shield_value: value.ShieldValue,
      magic_attack_value: value.MagicAttackValue,
      magic_defense_value: value.MagicDefenseValue,
      passive_skill_name: value.PassiveSkillName,
      waza_id: value.WazaID.replace('EPalWazaID::', ''),
      corruption_factor: value.CorruptionFactor,
      float_value1: value.FloatValue1,
    });
  }

  const itemRecipeMap = new Map<string, ItemRecipeType>();
  for (const [key, value] of itemRecipeRows) {
    if (item_recipe_filters.some((filter) => key.includes(filter))) {
      continue;
    }
    itemRecipeMap.set(key, {
      product_id: value.Product_Id,
      product_count: value.Product_Count,
      work_amount: value.WorkAmount,
      workable_attribute: value.WorkableAttribute,
      unlock_item_id: value.UnlockItemID !== 'None' ? value.UnlockItemID : null,
      required_materials: [
        {
          material_id: value.Material1_Id,
          material_count: value.Material1_Count,
        },
        {
          material_id: value.Material2_Id,
          material_count: value.Material2_Count,
        },
        {
          material_id: value.Material3_Id,
          material_count: value.Material3_Count,
        },
        {
          material_id: value.Material4_Id,
          material_count: value.Material4_Count,
        },
        {
          material_id: value.Material5_Id,
          material_count: value.Material5_Count,
        },
      ].filter((mat) => mat.material_id !== 'None'),
      energy_type: value.EnergyType,
      energy_amount: value.EnergyAmount,
      editor_row_name_hash: value.Editor_RowNameHash,
    });
  }

  return {
    food_status_effects: getFoodStatusEffectData(),
    item_data: itemDataTableMap,
    recipe_data: itemRecipeMap,
  };
};

/**
 * The items that are filtered out due to something like data missing, or it not being in the game yet.
 */
const item_recipe_filters = [
  '_NPC',
  'PV_',
  'MonsterEquipWeapon_Dummy',
  'ClothArmor_2',
  'ClothArmor_3',
  'ClothArmor_4',
  'ClothArmor_5',
  'ClothArmorHeat_2',
  'ClothArmorHeat_3',
  'ClothArmorHeat_4',
  'ClothArmorHeat_5',
  'ClothArmorCold_2',
  'ClothArmorCold_3',
  'ClothArmorCold_4',
  'ClothArmorCold_5',
  'CopperArmor_2',
  'CopperArmor_3',
  'CopperArmor_4',
  'CopperArmor_5',
  'CopperArmorHeat_2',
  'CopperArmorHeat_3',
  'CopperArmorHeat_4',
  'CopperArmorHeat_5',
  'CopperArmorCold_2',
  'CopperArmorCold_3',
  'CopperArmorCold_4',
  'CopperArmorCold_5',
  'FurArmor_2',
  'FurArmor_3',
  'FurArmor_4',
  'FurArmor_5',
  'FurArmorHeat_2',
  'FurArmorHeat_3',
  'FurArmorHeat_4',
  'FurArmorHeat_5',
  'FurArmorCold_2',
  'FurArmorCold_3',
  'FurArmorCold_4',
  'FurArmorCold_5',
  'IronArmor_2',
  'IronArmor_3',
  'IronArmor_4',
  'IronArmor_5',
  'IronArmorHeat_2',
  'IronArmorHeat_3',
  'IronArmorHeat_4',
  'IronArmorHeat_5',
  'IronArmorCold_2',
  'IronArmorCold_3',
  'IronArmorCold_4',
  'IronArmorCold_5',
  'StealArmor_2',
  'StealArmor_3',
  'StealArmor_4',
  'StealArmor_5',
  'StealArmorHeat_2',
  'StealArmorHeat_3',
  'StealArmorHeat_4',
  'StealArmorHeat_5',
  'StealArmorCold_2',
  'StealArmorCold_3',
  'StealArmorCold_4',
  'StealArmorCold_5',
  'FurHelmet_2',
  'FurHelmet_3',
  'FurHelmet_4',
  'FurHelmet_5',
  'CopperHelmet_2',
  'CopperHelmet_3',
  'CopperHelmet_4',
  'CopperHelmet_5',
  'IronHelmet_2',
  'IronHelmet_3',
  'IronHelmet_4',
  'IronHelmet_5',
  'StealHelmet_2',
  'StealHelmet_3',
  'StealHelmet_4',
  'StealHelmet_5',
  'Head00',
  'Head01',
  'CarbonFiber2',
];
