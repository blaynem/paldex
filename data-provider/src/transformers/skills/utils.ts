import { DataProvider } from '../../data/data-provider';
import { PassiveSkillsDataType, EffectTargets } from '../../data/skills-data';
import { TransfomerErrorType } from '../types';
import { datakey_to_prefix, parseAndReplaceAttributes } from '../utils';
import { ActiveSkillsType, TransformedEffectType } from './types';

export const getActiveSkillData = (
  _data: DataProvider,
  skill_dev_name: string,
  transformer: string,
  log_error_fn: (error: TransfomerErrorType) => void
): ActiveSkillsType | null => {
  const _transformer = `${transformer} -- getSkillData`;
  const skill_data = _data.skills_data.active.get(skill_dev_name);
  if (!skill_data) {
    log_error_fn({
      transformer: _transformer,
      description: `Could not find skill data for skill: ${skill_dev_name}`,
      data: {
        skill_dev_name,
      },
    });
    return null;
  }

  const localized_name = _data.localization.skills.localized_skill_names.get(
    datakey_to_prefix.skills_action + skill_dev_name
  );
  if (!localized_name) {
    log_error_fn({
      transformer: _transformer,
      description: `Could not find localized name for skill: ${
        datakey_to_prefix.skills_action + skill_dev_name
      }`,
      data: {
        skill_dev_name,
        data_key: datakey_to_prefix.skills_action + skill_dev_name,
      },
    });
  }

  const localized_description =
    _data.localization.skills.localized_skill_descriptions.get(
      datakey_to_prefix.skills_action + skill_dev_name
    );
  if (!localized_description) {
    log_error_fn({
      transformer: _transformer,
      description: `Could not find localized description for skill: ${
        datakey_to_prefix.skills_action + skill_dev_name
      }`,
      data: {
        skill_dev_name,
        data_key: datakey_to_prefix.skills_action + skill_dev_name,
      },
    });
  }

  // TODO: Can we find translations for these? It didn't seem like they existed.
  const effect_types = skill_data.effect_types
    .map((effect) => {
      return {
        type: effect.type,
        value: effect.value,
      };
    })
    .filter((v) => v.type !== 'None');

  const data: ActiveSkillsType = {
    is_unique_skill: skill_data.is_unique_skill,
    id: skill_data.id,
    name: localized_name
      ? parseAndReplaceAttributes(
          _data,
          _transformer,
          localized_name,
          log_error_fn
        )
      : 'Missing...',
    power: skill_data.power,
    cool_down_time: skill_data.cool_time,
    category: skill_data.skill_category,
    description: localized_description
      ? parseAndReplaceAttributes(
          _data,
          _transformer,
          localized_description,
          log_error_fn
        )
      : 'Missing...',
    element_type: skill_data.element,
    effect_types: effect_types,
    min_range: skill_data.min_range,
    max_range: skill_data.max_range,
    is_disabled_data: skill_data.is_disabled_data,
  };

  // Only apply this if it exists.
  if (skill_data.force_ragdoll_size !== 'None') {
    data.force_ragdoll_size = skill_data.force_ragdoll_size;
  }

  return data;
};

/**
 * Really we just need to worry about the Element ones first. The rest can
 * be split by _ and then joined with a space. The element requires a lookup.
 */
const passiveTypePrefixes = [
  'Element',
  'ElementBoost',
  'ElementResist',
  'ElementAddItemDrop',

  'FullStomatch_Decrease',
  'MoveSpeed',
  'TemperatureResist',
  'MaxHP',
  'MeleeAttack',
  'ShotAttack',
  'Defense',
  'Support',
  'CraftSpeed',
  'Homing',
  'Explosive',
  'BulletSpeed',
  'Recoil',
  'BulletAccuracy',
  'CollectItem',
  'Logging',
  'Mining',
  'GainItemDrop',
  'Mute',
  'LifeSteal',
  'MaxInventoryWeight',
  'Sanity_Decrease',
  'BodyPartsWeakDamage',
  'TemperatureInvalid_Cold',
  'TemperatureInvalid_Heat',
];
const passivePrefixMap = {
  ElementBoost: 'Boost',
  ElementResist: 'Resist',
  ElementAddItemDrop: 'Add Item Drop',
  Element: '',
} as const;

export const transformElementType = (
  _data: DataProvider,
  effectData: PassiveSkillsDataType['effects'][0],
  transformer: string,
  logErrorFn: (error: TransfomerErrorType) => void
): TransformedEffectType | null => {
  try {
    const _transformer = `${transformer} -- transformElementType`;

    let target = '';
    if (effectData.target === 'None') return null;
    target = EffectTargets[effectData.target as keyof typeof EffectTargets];
    if (!target) {
      logErrorFn({
        transformer: _transformer,
        description: `Could not find target for element: ${effectData.target}`,
        data: {
          elementData: effectData,
        },
      });
    }

    const getLocalizedElementName = (element: string) =>
      _data.localization.keys.get(datakey_to_prefix.element + element);

    const effectType = effectData.type;
    // "ElementBoost", "ElementResist", "ElementAddItemDrop",  "Element",
    // Check if it any of these, in order. If so we pull off the portion that is correct,
    // and return that as prefix + element type.
    if (passiveTypePrefixes.includes(effectType)) {
      const prefix =
        passivePrefixMap[effectType as keyof typeof passivePrefixMap] ||
        effectType;
      const element = getLocalizedElementName(effectType.replace(prefix, ''));

      return {
        text: `${prefix} ${element}`,
        value: effectData.value,
        target,
      };
    }

    // replace _, spit on camel case, join with space.
    const text = effectData.type
      .replace('_', '')
      .split(/(?=[A-Z])/)
      .join(' ');

    // If it is an ElementResist type, combine it with `_${rank}` to get correct value.
    // If it's TemperatureResist we append without the `_`.
    // If MoveSpeed, may have to check passive_dev_name to see what to parse.
    //  ex: MoveSpeed_up_PartnerSkill_Ride_1, MoveSpeed_up_PartnerSkill_2, MoveSpeed_up_1, though there is one with "Legend"
    // MaxHP - Look at dev_name
    // MeleeAttack - Look at dev_name
    // ShotAttack - we have _down, _up, some random names, PAL_ALLAttack_, PAL_{rude/sadist/etc}, PAL_ElementPassive_2, TrainerATK_UP_1, PAL_TribePassive_2, TrainerATK_UP_PartnerSkill_1, GiveElement_TrainerATK_UP_PartnerSkill_2, GiveElement_TrainerATK_UP_PartnerSkill_Ride_2, ATK_up_PartnerSkill_4
    // Defense - Look at dev_name, though have Legend
    // WE NEED TO JUST SEND IT, AND SEE WHAT HAPPENS.

    const someData: TransformedEffectType = {
      text: text,
      value: effectData.value,
      target,
    };
    return someData;
  } catch (e) {
    logErrorFn({
      transformer: transformer,
      description: `Error in transformElementType`,
      data: {
        effectData,
        error: e,
      },
    });
    return null;
  }
};
