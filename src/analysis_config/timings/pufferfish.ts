import { config } from '../types';

export default function getConfig(): config {
  return {
    'projectile.max-loads-per-projectile': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.pufferfish['projectile']['max-load-per-projectile']) >= 9;
            },
            vars: ['pufferfish'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in pufferfish.yml.\nRecommended: 8.',
      },
    ],
    'dab.enabled': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.pufferfish['dab']['enabled'] == 'false';
            },
            vars: ['pufferfish'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in pufferfish.yml.',
      },
    ],
  };
}