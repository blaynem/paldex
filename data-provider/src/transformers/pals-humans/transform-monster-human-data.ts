import { DataProvider } from '../../data/data-provider';
import { TransfomerErrorType } from '../types';
import {
  datakey_to_prefix,
  parseAndReplaceAttributes,
  filterOutTestKeys,
} from '../utils';
import { TransformedMonsterHumanData } from './types';
import { getPalsActiveSkillsData } from './utils';

// We can check the PARTNERSKILL_ prefix with monster name to check if the "LocalizedString" = "Tentative text".
// If it does, then we know its not actually implemented yet, so we can skip it in the errors.
const isTentative = (_data: DataProvider, skill_key: string): boolean => {
  const partner_skill_description =
    _data.localization.en.skills.localized_skill_names.get(skill_key);

  return partner_skill_description === 'Tentative text';
};

interface TransformMonsterHumanDataType {
  pals: TransformedMonsterHumanData[];
  humans: TransformedMonsterHumanData[];
  errors: TransfomerErrorType[];
}

export const tranform_monster_data = (
  _data: DataProvider
): TransformMonsterHumanDataType => {
  const errors: TransfomerErrorType[] = [];
  const ifErrorFn = (err: TransfomerErrorType) => {
    errors.push(err);
  };

  const allMonsterHumanNames = _data.monster_human_data.keys();
  const localization_keys = _data.localization.en.keys;
  const { localized_skill_names } = _data.localization.en.skills;

  const pals_data: TransformedMonsterHumanData[] = [];
  const humans_data: TransformedMonsterHumanData[] = [];
  for (const dev_name of allMonsterHumanNames) {
    // We skip all the test things.
    if (filterOutTestKeys(dev_name)) {
      continue;
    }
    const monster_data = _data.monster_human_data.get(dev_name)!;
    // If it has an override we need to do that instead
    // Seems like the localized pal_name can be undefined for certain ones.
    const localized_pal_name = getLocalizedPalName(
      _data,
      dev_name,
      'tranform_monster_data',
      ifErrorFn
    );

    const skill_key =
      monster_data.override_partner_skill_text_id !== 'None'
        ? monster_data.override_partner_skill_text_id
        : datakey_to_prefix.skills_partnerskill + dev_name;

    let partner_skill_title = localized_skill_names.get(skill_key);
    // Only log the error if the partner skill is not found AND it is a pal.
    // Because humans don't have partner skills.
    if (!partner_skill_title && monster_data.is_pal) {
      errors.push({
        transformer: 'transform-monster-data',
        description: 'Failed to get partner skill title',
        data: {
          skill_key,
          monsterName: dev_name,
        },
      });
    }

    // For the description we need to replace the prefix
    let partner_skill_description = localization_keys.get(
      skill_key.replace(
        datakey_to_prefix.skills_partnerskill,
        'PAL_FIRST_SPAWN_DESC_'
      )
    );
    // Overwrite the partner skill if it has an override
    if (monster_data.override_partner_skill_text_id !== 'None') {
      const override_partner_skill_text_key =
        monster_data.override_partner_skill_text_id.replace(
          datakey_to_prefix.skills_partnerskill,
          'PAL_FIRST_SPAWN_DESC_'
        );
      const override_partner_skill = localization_keys.get(
        override_partner_skill_text_key
      ); // Not sure if this is the correct key to use
      if (!override_partner_skill && !isTentative(_data, skill_key)) {
        errors.push({
          transformer: 'transform-monster-data',
          description: 'Failed to get override partner skill',
          data: {
            override_partner_skill_text_key,
            monsterName: dev_name,
          },
        });
      }
      partner_skill_title = override_partner_skill || partner_skill_title;

      const override_partner_skill_description_key =
        monster_data.override_partner_skill_text_id.replace(
          datakey_to_prefix.skills_partnerskill,
          'PAL_FIRST_SPAWN_DESC_'
        );
      const override_partner_skill_description = localization_keys.get(
        override_partner_skill_description_key
      );

      if (
        !override_partner_skill_description &&
        !isTentative(_data, skill_key)
      ) {
        errors.push({
          transformer: 'transform-monster-data',
          description: 'Failed to get override partner skill description',
          data: {
            override_partner_skill_description_key,
            monsterName: dev_name,
          },
        });
      }
      partner_skill_description =
        override_partner_skill_description || partner_skill_description;
    }

    const elements = [monster_data.element_type_1, monster_data.element_type_2]
      .map(
        (_el) => _data.localization.en.keys.get(`COMMON_ELEMENT_NAME_${_el}`)!
      )
      .filter(Boolean);

    const passive_skills = [
      monster_data.passive_skill_1,
      monster_data.passive_skill_2,
      monster_data.passive_skill_3,
      monster_data.passive_skill_4,
    ]
      .map((skill) => {
        return localized_skill_names.get(
          datakey_to_prefix.skills_passive + skill
        );
      })
      .filter(Boolean) as string[];

    const pal_name = localized_pal_name || dev_name;
    const pal_description =
      _data.localization.en.keys.get(
        datakey_to_prefix.pal_long_description + dev_name
      ) || 'Missing...';

    const active_skills = getPalsActiveSkillsData(
      _data,
      'tranform_monster_data',
      monster_data,
      ifErrorFn
    );

    // Check for technology unlocks
    let related_technology: TransformedMonsterHumanData['related_technology'] =
      null;
    if (monster_data.is_pal) {
      const skill_desc = _data.localization.en.keys.get(
        datakey_to_prefix.skill_unlock_desc + dev_name
      );
      const skill_name = _data.localization.en.keys.get(
        datakey_to_prefix.skill_unlock_name + dev_name
      );
      // We don't really know which thing has related tech or not, so we can't log an error.
      if (skill_desc && skill_name) {
        related_technology = {
          // This intentionally differs from the other keys to be `SkillUnlock_`
          // as this is the key used for the item.
          dev_technology_name: datakey_to_prefix.skill_unlock + dev_name,
          technology_name: parseAndReplaceAttributes(
            _data,
            'tranform_monster_data',
            skill_name || 'Missing...',
            ifErrorFn
          ),
          description: parseAndReplaceAttributes(
            _data,
            'tranform_monster_data',
            skill_desc || 'Missing...',
            ifErrorFn
          ),
        };
      }
    }

    const entry: TransformedMonsterHumanData = {
      related_technology: related_technology,
      is_pal: monster_data.is_pal,
      is_available_ingame: localized_pal_name !== 'en_text',
      pal_dev_name: dev_name,
      pal_name,
      pal_description: parseAndReplaceAttributes(
        _data,
        'tranform_monster_data',
        pal_description,
        ifErrorFn
      ),
      partner_skill_title: partner_skill_title
        ? parseAndReplaceAttributes(
            _data,
            'tranform_monster_data',
            partner_skill_title,
            ifErrorFn
          )
        : 'Missing...',
      partner_skill_description: partner_skill_description
        ? parseAndReplaceAttributes(
            _data,
            'tranform_monster_data',
            partner_skill_description,
            ifErrorFn
          )
        : 'Missing...',
      elements: elements,
      item_drops: _data.item_data.pal_item_drops.get(dev_name) || [],
      passive_skills,
      rarity: monster_data.rarity,
      work_suitability: {
        emit_flame: monster_data.work_suitability_EmitFlame,
        watering: monster_data.work_suitability_Watering,
        seeding: monster_data.work_suitability_Seeding,
        generate_electricity: monster_data.work_suitability_GenerateElectricity,
        handcraft: monster_data.work_suitability_Handcraft,
        collection: monster_data.work_suitability_Collection,
        deforest: monster_data.work_suitability_Deforest,
        mining: monster_data.work_suitability_Mining,
        oil_extraction: monster_data.work_suitability_OilExtraction,
        product_medicine: monster_data.work_suitability_ProductMedicine,
        cool: monster_data.work_suitability_Cool,
        transport: monster_data.work_suitability_Transport,
        monster_farm: monster_data.work_suitability_MonsterFarm,
      },
      stats: {
        hp: monster_data.hp,
        melee_attack: monster_data.melee_attack,
        shot_attack: monster_data.shot_attack,
        size: monster_data.size,
        defense: monster_data.defense,
        support: monster_data.support,
        walk_speed: monster_data.walk_speed,
        run_speed: monster_data.run_speed,
        ride_sprint_speed: monster_data.ride_sprint_speed,
        transport_speed: monster_data.transport_speed,
        full_stomach_decrease_rate: monster_data.full_stomach_decrease_rate,
        max_full_stomach: monster_data.max_full_stomach,
        food_amount: monster_data.food_amount,
        viewing_angle: monster_data.viewing_angle,
        viewing_distance: monster_data.viewing_distance,
        hearing_rate: monster_data.hearing_rate,
        stamina: monster_data.stamina,
      },
      male_probability: monster_data.male_probability,
      combi_rank: monster_data.combi_rank,
      noose_trap: monster_data.noose_trap,
      nocturnal: monster_data.nocturnal,
      biological_grade: monster_data.biological_grade,
      predator: monster_data.predator,
      edible: monster_data.edible,
      battle_bgm: monster_data.battle_bgm,
      is_boss: monster_data.is_boss,
      is_tower_boss: monster_data.is_tower_boss,
      craft_speed: monster_data.craft_speed,
      capture_rate_correct: monster_data.capture_rate_correct,
      experience_ratio: monster_data.experience_ratio,
      price: monster_data.price,
      genus_category: monster_data.genus_category,
      organization: monster_data.organization,
      can_equip_weapon: monster_data.can_equip_weapon,
      ai_response: monster_data.ai_response,
      ai_sight_response: monster_data.ai_sight_response,
      pal_index: monster_data.zukan_index + monster_data.zukan_index_suffix,
      active_skills,
    };

    if (monster_data.is_pal) {
      pals_data.push(entry);
    } else {
      humans_data.push(entry);
    }
  }

  return {
    pals: pals_data,
    humans: humans_data,
    errors,
  };
};

export const getLocalizedPalName = (
  _data: DataProvider,
  dev_name: string,
  transformer: string,
  log_error_fn: (error: TransfomerErrorType) => void
): string | undefined => {
  const localization_keys = _data.localization.en.keys;

  const monster_data = _data.monster_human_data.get(dev_name);
  if (!monster_data) {
    log_error_fn({
      transformer: `getLocalizedPalName-${transformer}`,
      description: 'Failed to get monster data',
      data: {
        monsterName: dev_name,
      },
    });
    return undefined;
  }

  // If it has an override we need to do that instead
  // Seems like the localized pal_name can be undefined for certain ones.
  let localized_pal_name = localization_keys.get(
    datakey_to_prefix.pal_name + dev_name
  );
  if (monster_data.override_name_text_id !== 'None') {
    const override_name = localization_keys.get(
      monster_data.override_name_text_id
    );
    // We occasionally have errors where the override name is not correctly capitalized.
    // So just throw an error so we can go fix it in the data we ported.
    if (!override_name) {
      log_error_fn({
        transformer: `getLocalizedPalName-${transformer}`,
        description: 'Failed to get override name',
        data: {
          override_name: monster_data.override_name_text_id,
          monsterName: dev_name,
        },
      });
    }
    localized_pal_name = override_name ?? localized_pal_name;
  }
  if (monster_data.name_prefix_id !== 'None') {
    const prefix = localization_keys.get(monster_data.name_prefix_id);
    if (prefix) {
      localized_pal_name = `${prefix} ${localized_pal_name}`;
    } else {
      log_error_fn({
        transformer: `getLocalizedPalName-${transformer}`,
        description: 'Failed to get prefix',
        data: {
          prefix: monster_data.name_prefix_id,
          monsterName: dev_name,
        },
      });
    }
  }
  return localized_pal_name;
};
