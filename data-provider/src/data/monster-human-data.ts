import monster_parameter from '../../palworld-assets/DataTable/Character/DT_PalMonsterParameter.json';
import enHumanParameter from '../../palworld-assets/DataTable/Character/DT_PalHumanParameter.json';
import skillLevelsData from '../../palworld-assets/DataTable/Waza/DT_WazaMasterLevel.json';

export interface MonsterHumanData {
  element_type_1: string;
  element_type_2: string;
  zukan_index: number;
  zukan_index_suffix: string;
  size: string;
  rarity: number;
  genus_category: string;
  organization: string;
  weapon: string;
  can_equip_weapon: boolean;
  hp: number;
  melee_attack: number;
  shot_attack: number;
  defense: number;
  support: number;
  craft_speed: number;
  capture_rate_correct: number;
  experience_ratio: number;
  price: number;
  ai_response: string;
  ai_sight_response: string;
  slow_walk_speed: number;
  walk_speed: number;
  run_speed: number;
  ride_sprint_speed: number;
  transport_speed: number;
  is_boss: boolean;
  is_tower_boss: boolean;
  battle_bgm: string;
  max_full_stomach: number;
  full_stomach_decrease_rate: number;
  food_amount: number;
  viewing_distance: number;
  viewing_angle: number;
  hearing_rate: number;
  noose_trap: boolean;
  nocturnal: boolean;
  biological_grade: number;
  predator: boolean;
  edible: boolean;
  stamina: number;
  male_probability: number;
  combi_rank: number;
  work_suitability_EmitFlame: number;
  work_suitability_Watering: number;
  work_suitability_Seeding: number;
  work_suitability_GenerateElectricity: number;
  work_suitability_Handcraft: number;
  work_suitability_Collection: number;
  work_suitability_Deforest: number;
  work_suitability_Mining: number;
  work_suitability_OilExtraction: number;
  work_suitability_ProductMedicine: number;
  work_suitability_Cool: number;
  work_suitability_Transport: number;
  work_suitability_MonsterFarm: number;
  passive_skill_1: string;
  passive_skill_2: string;
  passive_skill_3: string;
  passive_skill_4: string;
  override_partner_skill_text_id: string;
  override_name_text_id: string;
  name_prefix_id: string;
  is_pal: boolean;
  active_skills: {
    skill_dev_name: string;
    level_learned: number;
  }[];
}

export const create_monster_human_data = (): Map<string, MonsterHumanData> => {
  const humanRows = Object.entries(enHumanParameter[0].Rows);
  const monsterRows = Object.entries(monster_parameter[0].Rows);
  const rows = humanRows.concat(monsterRows);

  const dataMap = new Map<string, MonsterHumanData>();
  for (const [key, value] of rows) {
    // We have to fix the text because somehow its not aligned correctly.?
    const convertOverridePartnerSkill =
      value.OverridePartnerSkillTextID !== 'None'
        ? 'PARTNERSKILL_' + value.Tribe.replace('EPalTribeID::', '')
        : 'None';

    // Find all the skills that a monster can learn. We need to loop through each entry and
    // find via PalID, returning the WazaID and splitting off the `EPalWazaID::` from it
    const active_skills = Object.entries(skillLevelsData[0].Rows)
      .filter(([, v]) => v.PalID === key)
      .map(([, v]) => ({
        skill_dev_name: v.WazaID.replace('EPalWazaID::', ''),
        level_learned: v.Level,
      }));

    dataMap.set(key, {
      active_skills: active_skills,
      name_prefix_id: value.NamePrefixID,
      override_partner_skill_text_id: convertOverridePartnerSkill,
      override_name_text_id: value.OverrideNameTextID,
      element_type_1: value.ElementType1.replace('EPalElementType::', ''),
      element_type_2: value.ElementType2.replace('EPalElementType::', ''),
      zukan_index: value.ZukanIndex,
      zukan_index_suffix: value.ZukanIndexSuffix,
      size: value.Size.replace('EPalSizeType::', ''),
      rarity: value.Rarity,
      genus_category: value.GenusCategory.replace(
        'EPalGenusCategoryType::',
        ''
      ),
      organization: value.Organization.replace('EPalOrganizationType::', ''),
      weapon: value.weapon.replace('EPalWeaponType::', ''),
      can_equip_weapon: value.WeaponEquip,
      hp: value.HP,
      melee_attack: value.MeleeAttack,
      shot_attack: value.ShotAttack,
      defense: value.Defense,
      support: value.Support,
      craft_speed: value.CraftSpeed,
      capture_rate_correct: value.CaptureRateCorrect,
      experience_ratio: value.ExpRatio,
      price: value.Price,
      ai_response: value.AIResponse,
      ai_sight_response: value.AISightResponse,
      slow_walk_speed: value.SlowWalkSpeed,
      walk_speed: value.WalkSpeed,
      run_speed: value.RunSpeed,
      ride_sprint_speed: value.RideSprintSpeed,
      transport_speed: value.TransportSpeed,
      is_boss: value.IsBoss,
      is_tower_boss: value.IsTowerBoss,
      battle_bgm: value.BattleBGM.replace('EPalBattleBGMType::', ''),
      max_full_stomach: value.MaxFullStomach,
      full_stomach_decrease_rate: value.FullStomachDecreaseRate,
      food_amount: value.FoodAmount,
      viewing_distance: value.ViewingDistance,
      viewing_angle: value.ViewingAngle,
      hearing_rate: value.HearingRate,
      noose_trap: value.NooseTrap,
      nocturnal: value.Nocturnal,
      biological_grade: value.BiologicalGrade,
      predator: value.Predator,
      edible: value.Edible,
      stamina: value.Stamina,
      male_probability: value.MaleProbability,
      combi_rank: value.CombiRank,
      work_suitability_EmitFlame: value.WorkSuitability_EmitFlame,
      work_suitability_Watering: value.WorkSuitability_Watering,
      work_suitability_Seeding: value.WorkSuitability_Seeding,
      work_suitability_GenerateElectricity:
        value.WorkSuitability_GenerateElectricity,
      work_suitability_Handcraft: value.WorkSuitability_Handcraft,
      work_suitability_Collection: value.WorkSuitability_Collection,
      work_suitability_Deforest: value.WorkSuitability_Deforest,
      work_suitability_Mining: value.WorkSuitability_Mining,
      work_suitability_OilExtraction: value.WorkSuitability_OilExtraction,
      work_suitability_ProductMedicine: value.WorkSuitability_ProductMedicine,
      work_suitability_Cool: value.WorkSuitability_Cool,
      work_suitability_Transport: value.WorkSuitability_Transport,
      work_suitability_MonsterFarm: value.WorkSuitability_MonsterFarm,
      passive_skill_1: value.PassiveSkill1,
      passive_skill_2: value.PassiveSkill2,
      passive_skill_3: value.PassiveSkill3,
      passive_skill_4: value.PassiveSkill4,
      is_pal: value.IsPal,
    });
  }

  return dataMap;
};
