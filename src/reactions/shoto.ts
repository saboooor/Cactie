import { Reaction } from 'types/Objects';

export const shoto: Reaction = {
  triggers: ['shoto'],
  execute: (message) => {
    message.react('867259182642102303').catch(err => logger.error(err));
    message.react('😩').catch(err => logger.error(err));
  },
};