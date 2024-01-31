export interface ActiveSkillsType {
  id: string;
  name: string;
  power: number;
  cool_down_time: number;
  category: string;
  description: string;
  element_type: string;
  effect_types: {
    type: string;
    value: number;
  }[];
  min_range: number;
  max_range: number;
  /**
   * This is just saying it's not in the game yet, I believe.
   */
  is_disabled_data: boolean;
  /**
   * Determins if this skill is unique to the Pal or NPC.
   */
  is_unique_skill: boolean;
  /**
   * The size of enemy that this skill will ragdoll.
   */
  force_ragdoll_size?: string;
}

export interface TransformedEffectType {
  text: string;
  value: number;
  target: string;
}
export interface TransformedPassiveSkillsData {
  skill_name: string;
  skill_dev_name: string;
  rank: number;
  effects: TransformedEffectType[];
  invoked: {
    worker?: boolean;
    riding?: boolean;
    reserve?: boolean;
    in_otomo?: boolean;
    always?: boolean;
  };
  passive_adds_to: {
    pal?: boolean;
    rare_pal?: boolean;
    shot_weapon?: boolean;
    melee_weapon?: boolean;
    armor?: boolean;
    accessory?: boolean;
  };
}

export interface TransformedSkillsData {
  active_skills: ActiveSkillsType[];
  passive_skills: TransformedPassiveSkillsData[];
}
