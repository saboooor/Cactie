/* eslint-disable @typescript-eslint/no-unused-vars */

import { Command } from '~/types/Objects';
import util from 'util';
import prisma from '~/functions/prisma';

export const ec: Command = {
  description: 'Runs code specified in args',
  aliases: ['eval', 'execute'],
  args: true,
  usage: '<Code>',
  cooldown: 0.1,
  async execute(message, args, client) {
    // Check if user has dev in Luminescent Discord Server
    const luminescent = client.guilds.cache.get('811354612547190794')!;
    const luminescentMember = luminescent.members.cache.get(message.member!.id);
    if (luminescentMember ? !luminescentMember.roles.cache.has('839158574138523689') : true) return;
    try {
      const code = args.join(' ');
      let evaled = eval(code);
      if (typeof evaled !== 'string') { evaled = util.inspect(evaled); }
      message.reply({ content: evaled });
    }
    catch (err) { error(err, message, true); }
  },
};
