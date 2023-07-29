import { EmbedBuilder, ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import actions from '~/misc/actions.json';

let current: number;

export default async function action(interaction: StringSelectMenuInteraction<'cached'> | ChatInputCommandInteraction<'cached'>, target: string | null, type: keyof typeof actions) {
  // Check if arg is a user and set it
  let user;
  if (target) {
    user = interaction.guild.members.cache.get(target.replace(/\D/g, ''));
    if (user) target = user.displayName;
  }

  // Get random index of gif list
  let i = Math.floor(Math.random() * actions[type].gifs.length);

  // If index is the same as the last one, get a new one
  if (i === current) {
    do i = Math.floor(Math.random() * actions[type].gifs.length);
    while (i === current);
    current = i;
  }

  // Create embed with bonk gif and author / footer
  const BonkEmbed = new EmbedBuilder()
    .setAuthor({ name: `${interaction.member.displayName} ${actions[type].plural} ${target ?? ''}`, iconURL: interaction.member.displayAvatarURL() })
    .setImage(actions[type].gifs[i])
    .setFooter({ text: actions[type].footer });

  // Reply with bonk message, if user is set then mention the user
  if (interaction instanceof StringSelectMenuInteraction) {
    interaction.message.delete();
    interaction.message.channel.send({ content: user ? `${user}` : undefined, embeds: [BonkEmbed] });
    return;
  }
  interaction.reply({ content: user ? `${user}` : undefined, embeds: [BonkEmbed] });
}