import { DataProvider } from '../../data/data-provider';
import { MonsterHumanData } from '../../data/monster-human-data';
import { getActiveSkillData } from '../skills/utils';
import { TransfomerErrorType } from '../types';
import { datakey_to_prefix } from '../utils';
import { getLocalizedPalName } from './transform-monster-human-data';
import { PalActiveSkillsType } from './types';

export const getPalsActiveSkillsData = (
  _data: DataProvider,
  transformer: string,
  monster_data: MonsterHumanData,
  log_error_fn: (error: TransfomerErrorType) => void
): PalActiveSkillsType[] => {
  const _transformer = `${transformer} -- getActiveSkillsData`;
  // Find all the skills that a monster can learn. We need to loop through each entry and
  // find via PalID, returning the WazaID and splitting off the `EPalWazaID::` from it
  const active_skills = monster_data.active_skills.map((skill) => {
    const skill_data = getActiveSkillData(
      _data,
      skill.skill_dev_name,
      _transformer,
      log_error_fn
    );
    if (!skill_data) {
      return null;
    }

    const data: PalActiveSkillsType = {
      ...skill_data,
      level_learned: skill.level_learned,
    };

    return data;
  });

  return active_skills.filter((skill): skill is PalActiveSkillsType =>
    Boolean(skill)
  );
};

/**
 * Generates the localized character name
 * @param _data - The data provider
 * @param _dev_name - The dev name of the pal, character, npc, anything
 * @param log_error_fn - Fn callback
 * @returns
 */
export const get_localized_character_name = (
  _data: DataProvider,
  _dev_name: string, // This may get translated in the case of something like the Believer_Bat name
  log_error_fn: (error: TransfomerErrorType) => void
): {
  dev_name: string;
  localized_name: string;
  localized_name_without_weapon: string;
} => {
  // First we check if it's a pal
  const localized_dropper_name = getLocalizedPalName(
    _data,
    _dev_name,
    'get_localized_character_name',
    log_error_fn
  );

  // If it's not a pal, then we check if it's a human
  if (!localized_dropper_name) {
    const human_data = _data.monster_human_data.get(_dev_name);
    if (human_data) {
      const human_name = _data.localization.keys.get(
        human_data.override_name_text_id
      );

      if (!human_name) {
        log_error_fn({
          transformer: 'get_localized_character_name',
          description: `Could not get translated name for key: {human_data.override_name_text_id}`,
          data: { human_data },
        });
        return {
          dev_name: _dev_name,
          localized_name: _dev_name,
          localized_name_without_weapon: _dev_name,
        };
      }

      const isInvader = _dev_name.includes('Invader'); // Note uppercase
      // We assume if it has a MeleeWeapon it is a generic enemy dropping it.
      const isGenericEnemy = human_data.weapon.includes('MeleeWeapon');

      // I don't know if we have translation for MeleeWeapon, so might just have to
      // If it's something else, we can search it through the keys`ITEM_NAME_`
      // We can get the weapon name from the dropper name potentially. Believer_Bat -> Bat
      let weapon = '';
      if (!isGenericEnemy) {
        weapon =
          _data.localization.keys.get(
            datakey_to_prefix.item_name + human_data.weapon
          ) || '';
      }

      let localized_name = human_name;
      isInvader && (localized_name += ' Invader');
      weapon && (localized_name += ` <${weapon}>`);
      // Name will be something like name + Invader? + weapon
      return {
        dev_name: _dev_name,
        localized_name,
        localized_name_without_weapon: isInvader
          ? `${human_name} Invader`
          : human_name,
      };
    }
  }
  return {
    dev_name: _dev_name,
    localized_name: localized_dropper_name || _dev_name,
    localized_name_without_weapon: localized_dropper_name || _dev_name,
  };
};
