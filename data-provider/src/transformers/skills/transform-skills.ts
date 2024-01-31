import { DataProvider } from '../../data/data-provider';
import { TransfomerErrorType } from '../types';
import { datakey_to_prefix } from '../utils';
import {
  ActiveSkillsType,
  TransformedEffectType,
  TransformedPassiveSkillsData,
  TransformedSkillsData,
} from './types';
import { getActiveSkillData, transformElementType } from './utils';

export const transform_skills_data = (
  _data: DataProvider
): { data: TransformedSkillsData; errors: TransfomerErrorType[] } => {
  const _transformer = 'transform_skills_data';
  const errors: TransfomerErrorType[] = [];
  const logErrorFn = (error: TransfomerErrorType) => {
    errors.push(error);
  };

  const active_skills: ActiveSkillsType[] = [];
  for (const [dev_skill_name] of _data.skills_data.active) {
    const skill_data = getActiveSkillData(
      _data,
      dev_skill_name,
      _transformer,
      logErrorFn
    );
    if (!skill_data) {
      continue;
    }
    active_skills.push(skill_data);
  }

  const passive_skills: TransformedPassiveSkillsData[] = [];
  for (const [dev_skill_name, skill_data] of _data.skills_data.passive) {
    const localized_name =
      _data.localization.en.skills.localized_skill_names.get(
        datakey_to_prefix.skills_passive + dev_skill_name
      );
    if (!localized_name) {
      logErrorFn({
        transformer: _transformer,
        description: `Could not find localized name for passive skill: ${
          datakey_to_prefix.skills_passive + dev_skill_name
        }`,
        data: {
          dev_skill_name,
          data_key: datakey_to_prefix.skills_passive + dev_skill_name,
        },
      });
      continue;
    }

    // If there's an override description, we use that. It includes the prefix portion.
    const localized_description_key =
      skill_data.override_description_message_id ||
      datakey_to_prefix.skills_passive + dev_skill_name;

    const localized_description =
      _data.localization.en.skills.localized_skill_descriptions.get(
        localized_description_key
      );
    if (!localized_description) {
      logErrorFn({
        transformer: _transformer,
        description: `Could not find localized description for passive skill: ${localized_description_key}`,
        data: {
          dev_skill_name,
          data_key: localized_description_key,
        },
      });
    }

    const effects = skill_data.effects
      .map((e) => transformElementType(_data, e, _transformer, logErrorFn))
      .filter((e) => e !== null) as TransformedEffectType[];

    const data: TransformedPassiveSkillsData = {
      skill_name: localized_name,
      skill_dev_name: dev_skill_name,
      rank: skill_data.rank,
      effects,
      invoked: skill_data.invoked,
      passive_adds_to: skill_data.skill_add_to,
    };

    passive_skills.push(data);
  }

  return {
    data: {
      active_skills,
      passive_skills,
    },
    errors,
  };
};
