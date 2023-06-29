/* eslint-disable @typescript-eslint/no-unused-vars */

import { Command } from '~/types/Objects';
import util from 'util';
import prisma from '~/functions/prisma';

export const ec: Command = {
  description: 'Runs code specified in args',
  async execute(message, args, client) {
    try {
      const code = args.join(' ');
      let evaled = eval(code);
      if (typeof evaled !== 'string') { evaled = util.inspect(evaled); }
      message.reply({ content: evaled });
    }
    catch (err) { error(err, message, true); }
  },
};
