import { Command } from '~/types/Objects';

export const crash: Command = {
  description: 'crashes the bot',
  execute(message, args, client) {
    // Check if user has dev in Luminescent Discord Server
    const luminescent = client.guilds.cache.get('811354612547190794')!;
    const luminescentMember = luminescent.members.cache.get(message.member!.id);
    if (luminescentMember ? !luminescentMember.roles.cache.has('839158574138523689') : true) return;
    throw new Error('Manually Crashed');
  },
};