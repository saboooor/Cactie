import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { Command } from '~/types/Objects';

export const dm: Command = {
  description: 'DM someone through Cactie bot.',
  async execute(message, args, client) {
    try {
      // Get user and check if they exist
      const user = client.users.cache.get(args[0].replace(/\D/g, ''));
      if (!user) {
        error('Invalid User!', message, true);
        return;
      }

      // Check if message has any attachments and add it to the dm (idek if it works now tbh)
      const files = [];
      for (const attachment of message.attachments) {
        const response = await fetch(attachment[1].url, { method: 'GET' });
        const arrayBuffer = await response.arrayBuffer();
        const img = new AttachmentBuilder(Buffer.from(arrayBuffer), { name: attachment[1].name });
        files.push(img);
      }

      // Send DM to user
      user.send({ content: args.slice(1).join(' '), files })
        .catch(err => logger.warn(err));

      // Create response embed and respond
      const DMEmbed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`**Message sent to ${user}!**\n**Content:** ${args.slice(1).join(' ')}`);
      message.reply({ embeds: [DMEmbed] });
    }
    catch (err) { error(err, message); }
  },
};