import { Command } from '~/types/Objects';

export const psa: Command = {
  description: 'Broadcasts a message to all server owners with the bot in them.',
  async execute(message, args, client) {
    if (!args[0]) {
      message.reply({ content: 'Please specify a message to broadcast.' });
      return;
    }

    // Dm all server owners
    client.guilds.cache.forEach(async guild => {
      const owner = await guild.fetchOwner();
      owner.send({ content: `${owner}\n\n${args.join(' ')}\n\n*You've been sent this message because ${client.user!.username} is in ${guild.name} and you're the owner of the server*` }).catch(err => logger.error(err));
    });

    // Send confirmation
    message.reply({ content: 'Broadcasted DM to all guild owners' });
  },
};