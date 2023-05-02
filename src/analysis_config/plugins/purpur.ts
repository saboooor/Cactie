export default function getConfig(): {
  [key: string]: {
    expressions?: {
      bool: (dict_of_vars: any) => boolean;
      vars: string[];
    }[];
    prefix: string;
    value: string;
    buttons?: {
      text: string;
      url: string;
    }[];
  }
  } {
  return {
    'SilkSpawners': {
      prefix: '❌',
      value: 'You probably don\'t need SilkSpawners as Purpur already has its features.',
    },
    'MineableSpawners': {
      prefix: '❌',
      value: 'You probably don\'t need MineableSpawners as Purpur already has its features.',
    },
    'VillagerLobotomizatornator': {
      prefix: '❌',
      value: 'You probably don\'t need VillagerLobotomizatornator as Purpur already adds its features.\nEnable villager.lobotomize.enabled in purpur.yml.',
    },
  };
}