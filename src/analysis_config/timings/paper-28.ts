import { Field } from '~/types/Field';

export default function getConfig(): {
  [key: string]: {
    expressions: {
      bool: (dict_of_vars: any) => boolean;
      vars: string[];
    }[];
    prefix: string;
    value: string;
  }[]
  } {
  return {
    'chunks.max-auto-save-chunks-per-tick': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['chunks']['max-auto-save-chunks-per-tick']) >= 24;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 6.',
      },
    ],
    'environment.optimize-explosions': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['environment']['optimize-explosions'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml.',
      },
    ],
    'tick-rates.mob-spawner': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['tick-rates']['mob-spawner']) == 1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Increase this in config/paper-world-defaults.yml.\nRecommended: 2.',
      },
    ],
    'entities.behavior.disable-chest-cat-detection': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['behavior']['disable-chest-cat-detection'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml',
      },
    ],
    'tick-rates.container-update': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['tick-rates']['container-update']) == 1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Increase this in config/paper-world-defaults.yml.\nRecommended: 3.',
      },
    ],
    'tick-rates.grass-spread': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['tick-rates']['grass-spread']) == 1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Increase this in config/paper-world-defaults.yml.\nRecommended: 4.',
      },
    ],
    'entities.spawning.despawn-ranges.ambient.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['ambient']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.ambient.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['ambient']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.axolotls.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['axolotls']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.axolotls.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['axolotls']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.creature.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['creature']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.creature.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['creature']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.misc.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['misc']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.misc.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['misc']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.monster.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['monster']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.monster.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['monster']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.underground_water_creature.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['underground_water_creature']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.underground_water_creature.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['underground_water_creature']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.water_ambient.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['water_ambient']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.water_ambient.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['water_ambient']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'entities.spawning.despawn-ranges.water_creature.soft': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['water_creature']['soft']) >= 32;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 28.',
      },
    ],
    'entities.spawning.despawn-ranges.water_creature.hard': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['despawn-ranges']['water_creature']['hard']) >= 128;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Decrease this in config/paper-world-defaults.yml.\nRecommended: 96.',
      },
    ],
    'hopper.disable-move-event': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['hopper']['disable-move-event'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml',
      },
    ],
    'entities.spawning.non-player-arrow-despawn-rate': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['non-player-arrow-despawn-rate']) == -1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set a value in config/paper-world-defaults.yml.\nRecommended: 60',
      },
    ],
    'entities.spawning.creative-arrow-despawn-rate': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['creative-arrow-despawn-rate']) == -1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set a value in config/paper-world-defaults.yml.\nRecommended: 60',
      },
    ],
    'chunks.prevent-moving-into-unloaded-chunks': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['chunks']['prevent-moving-into-unloaded-chunks'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml.',
      },
    ],
    'misc.redstone-implementation': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['misc']['redstone-implementation'] != 'ALTERNATE_CURRENT';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set this to "ALTERNATE_CURRENT" in config/paper-world-defaults.yml.',
      },
    ],
    'collisions.fix-climbing-bypassing-cramming-rule': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['collisions']['fix-climbing-bypassing-cramming-rule'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml.',
      },
    ],
    'entities.armor-stands.do-collision-entity-lookups': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['armor-stands']['do-collision-entity-lookups'] == 'true';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Disable this in config/paper-world-defaults.yml.',
      },
    ],
    'entities.armor-stands.tick': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['armor-stands']['tick'] == 'true';
            },
            vars: ['paper'],
          },
          {
            bool: dict_of_vars => {
              return dict_of_vars.plugins.find((plugin: Field) => plugin.name == 'PetBlocks') !== undefined;
            },
            vars: ['plugins'],
          },
          {
            bool: dict_of_vars => {
              return dict_of_vars.plugins.find((plugin: Field) => plugin.name == 'BlockBalls') !== undefined;
            },
            vars: ['plugins'],
          },
          {
            bool: dict_of_vars => {
              return dict_of_vars.plugins.find((plugin: Field) => plugin.name == 'ArmorStandTools') !== undefined;
            },
            vars: ['plugins'],
          },
        ],
        prefix: '❌',
        value: 'Disable this in config/paper-world-defaults.yml.',
      },
    ],
    'entities.spawning.per-player-mob-spawns': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['per-player-mob-spawns'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml.',
      },
    ],
    'entities.spawning.alt-item-despawn-rate.enabled': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return dict_of_vars.paper['__________WORLDS__________']['__defaults__']['entities']['spawning']['alt-item-despawn-rate']['enabled'] == 'false';
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Enable this in config/paper-world-defaults.yml.',
      },
    ],
    'chunks.entity-per-chunk-save-limit.experience_orb': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['chunks']['entity-per-chunk-save-limit']['experience_orb']) == -1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set a value in config/paper-world-defaults.yml.\nRecommended: 16.',
      },
    ],
    'chunks.entity-per-chunk-save-limit.snowball': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['chunks']['entity-per-chunk-save-limit']['snowball']) == -1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set a value in config/paper-world-defaults.yml.\nRecommended: 16.',
      },
    ],
    'chunks.entity-per-chunk-save-limit.ender_pearl': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['chunks']['entity-per-chunk-save-limit']['ender_pearl']) == -1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set a value in config/paper-world-defaults.yml.\nRecommended: 16.',
      },
    ],
    'chunks.entity-per-chunk-save-limit.arrow': [
      {
        expressions: [
          {
            bool: dict_of_vars => {
              return parseInt(dict_of_vars.paper['__________WORLDS__________']['__defaults__']['chunks']['entity-per-chunk-save-limit']['arrow']) == -1;
            },
            vars: ['paper'],
          },
        ],
        prefix: '❌',
        value: 'Set a value in config/paper-world-defaults.yml.\nRecommended: 16.',
      },
    ],
  };
}