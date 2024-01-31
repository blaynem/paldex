import { DataProvider } from '../../data/data-provider';
import { ItemDetailsTypes } from '../../data/item-data';
import { TransfomerErrorType } from '../types';
import { ItemTypeType, TransformedItemDetails } from './types';

export const determine_item_types = (item: ItemDetailsTypes): ItemTypeType => {
  const weapon_type = determine_weapon_type(item);
  const armor_slot = determine_armor_slot(item);
  const consumable_type = determine_consumable_type(item);
  const food_type = determine_food_type(item);
  const essential_type = determine_essential_type(item);
  const material_type = determine_material_type(item);
  const is_accessory = determine_is_accessory(item);
  const is_blueprint = determine_is_blueprint(item);
  const is_monster_equip_weapon = determine_is_monster_equip_weapon(item);

  const data = {
    is_ammo: item.type_a.includes('Ammo'),
    weapon_type,
    armor_slot,
    consumable_type,
    food_type,
    essential_type,
    material_type,
    is_accessory,
    is_blueprint,
    is_monster_equip_weapon,
  };

  // Removing any values so we don't send them over the wire.
  Object.keys(data).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(data as any)[key]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (data as any)[key];
    }
  });

  return data;
};

/**
 * Will be:
 * [
    "AssaultRifle",
    "Melee",
    "Crossbow",
    "Shotgun",
    "Handgun",
    "RocketLauncher",
    "SniperRifle",
    "FlameThrower",
    "GatlingGun",
    "ThrowObject",
    "Bow"
]
 */
const determine_weapon_type = (item: ItemDetailsTypes): string | undefined => {
  if (item.type_a.includes('Weapon') || item.type_b.includes('Weapon')) {
    if (item.type_a.includes('SPWeaponCapture')) {
      return item.type_b.replace('EPalItemTypeB::SPWeaponCapture', '');
    }
    return item.type_b.replace('EPalWeaponType::', '');
  }
  return undefined;
};

/**
 * Will be "Head" or "Body"
 */
const determine_armor_slot = (item: ItemDetailsTypes): string | undefined => {
  if (item.type_a.includes('Armor') || item.type_b.includes('Armor')) {
    return item.type_b.replace('EPalItemTypeA::', '');
  }
  return undefined;
};

/**
 * Will be:
 * [ConsumeWazaMachine, ConsumeOther, ConsumeBandage, FoodVegetable, ConsumeSeed, ConsumeTechnologyBook, ConsumeBullet]
 */
const determine_consumable_type = (
  item: ItemDetailsTypes
): string | undefined => {
  if (
    item.type_a.includes('Consumable') ||
    item.type_b.includes('Consumable')
  ) {
    // TODO: LOOK AT THIS?
    return item.type_b.replace('EPalItemTypeB::Consumable', '');
  }
  return undefined;
};

/**
 * Will be: [FoodDishMeat,FoodDishFish,FoodDishVegetable, Meat, Fish, Vegetable]
 */
const determine_food_type = (item: ItemDetailsTypes): string | undefined => {
  if (item.type_a.includes('Food') || item.type_b.includes('Food')) {
    // Replace EPalItemTypeB::Food
    return item.type_b.replace('EPalItemTypeB::Food', '');
  }
  return undefined;
};

/**
 * Will be: [Essential, or Essential_UnlockPlayerFuture]
 */
const determine_essential_type = (
  item: ItemDetailsTypes
): string | undefined => {
  if (item.type_a.includes('Essential') || item.type_b.includes('Essential')) {
    if (item.type_a.includes('Essential_UnlockPlayerFuture')) {
      return 'UnlockPlayerFuture';
    }
    return 'Essential';
  }
  return undefined;
};
/**
 * Will be: [Monster, Ingot, Proccessing, Ore, Wood, Stone, Jewelry, PalEgg]
 */
const determine_material_type = (
  item: ItemDetailsTypes
): string | undefined => {
  if (item.type_a.includes('Material') || item.type_b.includes('Material')) {
    return item.type_b.replace('EPalItemTypeB::Material', '');
  }
  return undefined;
};
/**
 * Just [Accessory]
 */
const determine_is_accessory = (item: ItemDetailsTypes): boolean => {
  return item.type_a.includes('Accessory') || item.type_b.includes('Accessory');
};
/**
 * Just [MonsterEquipWeapon]
 */
const determine_is_monster_equip_weapon = (item: ItemDetailsTypes): boolean => {
  return (
    item.type_a.includes('MonsterEquipWeapon') ||
    item.type_b.includes('MonsterEquipWeapon')
  );
};
/**
 * Just [Blueprint]
 */
const determine_is_blueprint = (item: ItemDetailsTypes): boolean => {
  return item.type_a.includes('Blueprint') || item.type_b.includes('Blueprint');
};

export const getFoodStatusEffectData = (
  _data: DataProvider,
  item: ItemDetailsTypes,
  dev_item_name: string,
  logErrorFn: (error: TransfomerErrorType) => void
): TransformedItemDetails['status_effects'] | null => {
  if (!determine_food_type(item)) {
    return null;
  }
  const statusEffects = _data.item_data.food_status_effects.get(dev_item_name);
  if (!statusEffects) {
    // It's kinda hard to know here since there's only a limited number of food items that grant effects.
    logErrorFn({
      transformer: 'getFoodStatusEffectData',
      description: `Could not find status effect for item: ${dev_item_name}`,
      data: { item },
    });
    return null;
  }
  return {
    effect_time: statusEffects.effect_time,
    effects: statusEffects.effects.map((effect) => ({
      effect_type: effect.effect_type,
      effect_value: effect.effect_value,
    })),
  };
};
