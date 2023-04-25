import { EmbedBuilder } from 'discord.js';
import reactionsList from '../../lists/reactions';
import { SlashCommand } from 'types/Objects';

export const reactions: SlashCommand = {
  description: 'See what words Cactie reacts to',
  voteOnly: true,
  ephemeral: true,
  cooldown: 10,
  execute(message) {
    try {
      const ReactionEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Here are my reactions');
      reactionsList.forEach(reaction => {
        ReactionEmbed.addFields([{ name: `${reaction.name}`, value: `${reaction.additionaltriggers ? `${reaction.additionaltriggers}\n` : ''}${reaction.triggers}` }]);
      });
      message.reply({ embeds: [ReactionEmbed] });
    }
    catch (err) { error(err, message); }
  },
};