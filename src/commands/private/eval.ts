/* eslint-disable @typescript-eslint/no-unused-vars */

import { Command } from 'types/Objects';
import util from 'util';

export const ec: Command = {
  description: 'Runs code specified in args',
  aliases: ['eval', 'execute'],
  args: true,
  usage: '<Code>',
  cooldown: 0.1,
  async execute(message, args, client) {
    // Check if user is sab lolololol
    if (message.author.id !== '249638347306303499') return error('You can\'t do that!', message, true);
    try {
      const code = args.join(' ');
      let evaled = eval(code);
      if (typeof evaled !== 'string') { evaled = util.inspect(evaled); }
      message.reply({ content: evaled });
    }
    catch (err) { error(err, message, true); }
  },
};
