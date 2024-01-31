import activeSkillsData from '../../palworld-assets/DataTable/Waza/DT_WazaDataTable.json';
import passiveSkillsData from '../../palworld-assets/DataTable/PassiveSkill/DT_PassiveSkill_Main.json';

export interface ActiveSkillsDataType {
  id: string;
  skill_name: string;
  element: string;
  skill_category: string;
  power: number;
  min_range: number;
  max_range: number;
  cool_time: number;
  force_ragdoll_size: string;
  effect_types: {
    type: string;
    value: number;
    value_Ex: number;
  }[];
  is_disabled_data: boolean;
  special_attack_rate_info: {
    element: string;
    rate: number;
  }[];
  is_unique_skill: boolean;
}

export const getActiveSkillsData = (): Map<string, ActiveSkillsDataType> => {
  const rows = Object.entries(activeSkillsData[0].Rows);

  const dataMap = new Map<string, ActiveSkillsDataType>();
  for (const [row_key, value] of rows) {
    const skill_name = value.WazaType.replace('EPalWazaID::', '');
    dataMap.set(skill_name, {
      is_unique_skill: skill_name.includes('Unique_'),
      special_attack_rate_info: value.SpecialAttackRateInfos.map((v) => ({
        // We remove the EPalSpecialAttackRateType::vs to just get the element
        element: v.Type.replace('EPalSpecialAttackRateType::vs', ''),
        rate: v.Rate,
      })),
      id: row_key.replace('NewRow_', ''),
      skill_name: skill_name,
      element: value.Element.replace('EPalElementType::', ''),
      skill_category: value.Category.replace('EPalWazaCategory::', ''),
      power: value.Power,
      min_range: value.MinRange,
      max_range: value.MaxRange,
      cool_time: value.CoolTime,
      force_ragdoll_size: value.ForceRagdollSize.replace('EPalSizeType::', ''),
      effect_types: [
        {
          type: value.EffectType1.replace('EPalAdditionalEffectType::', ''),
          value: value.EffectValue1,
          value_Ex: value.EffectValueEx1,
        },
        {
          type: value.EffectType2.replace('EPalAdditionalEffectType::', ''),
          value: value.EffectValue2,
          value_Ex: value.EffectValueEx2,
        },
      ],
      is_disabled_data: value.DisabledData,
    });
  }

  return dataMap;
};

export const EffectTargets = {
  ToSelf: 'To Self',
  ToTrainer: 'To Trainer',
  ToSelfAndTrainer: 'To Self And Trainer',
  None: '',
};

export interface PassiveSkillsDataType {
  skill_name: string;
  rank: number;
  override_description_message_id: string;
  effects: {
    type: string;
    value: number;
    target: keyof typeof EffectTargets;
  }[];
  invoked: {
    worker?: boolean;
    riding?: boolean;
    reserve?: boolean;
    in_otomo?: boolean;
    always?: boolean;
  };
  /**
   * Honestly not really sure wtf this is.
   */
  skill_add_to: {
    pal?: boolean;
    rare_pal?: boolean;
    shot_weapon?: boolean;
    melee_weapon?: boolean;
    armor?: boolean;
    accessory?: boolean;
  };
}

export const getPassiveSkillsData = (): Map<string, PassiveSkillsDataType> => {
  const rows = Object.entries(passiveSkillsData[0].Rows);

  const dataMap = new Map<string, PassiveSkillsDataType>();
  for (const [row_key, value] of rows) {
    const invoked = {
      worker: value.InvokeWorker,
      riding: value.InvokeRiding,
      reserve: value.InvokeReserve,
      in_otomo: value.InvokeInOtomo,
      always: value.InvokeAlways,
    };

    const skill_add_to = {
      pal: value.AddPal,
      rare_pal: value.AddRarePal,
      shot_weapon: value.AddShotWeapon,
      melee_weapon: value.AddMeleeWeapon,
      armor: value.AddArmor,
      accessory: value.AddAccessory,
    };

    // Removing any values from `invoked` so we don't send them over the wire.
    Object.keys(invoked).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(invoked as any)[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (invoked as any)[key];
      }
    });
    Object.keys(skill_add_to).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(skill_add_to as any)[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (skill_add_to as any)[key];
      }
    });

    dataMap.set(row_key, {
      skill_name: row_key,
      rank: value.Rank,
      override_description_message_id: value.OverrideDescMsgID,
      effects: [
        {
          type: value.EffectType1.replace('EPalPassiveSkillEffectType::', ''),
          value: value.EffectValue1,
          target: value.TargetType1.replace(
            'EPalPassiveSkillEffectTargetType::',
            ''
          ) as keyof typeof EffectTargets,
        },
        {
          type: value.EffectType2.replace('EPalPassiveSkillEffectType::', ''),
          value: value.EffectValue2,
          target: value.TargetType2.replace(
            'EPalPassiveSkillEffectTargetType::',
            ''
          ) as keyof typeof EffectTargets,
        },
        {
          type: value.EffectType3.replace('EPalPassiveSkillEffectType::', ''),
          value: value.EffectValue3,
          target: value.TargetType3.replace(
            'EPalPassiveSkillEffectTargetType::',
            ''
          ) as keyof typeof EffectTargets,
        },
      ].filter((v) => v.type !== 'no' || v.value > 0),
      invoked,
      skill_add_to,
    });
  }

  return dataMap;
};
