import { CommandInteraction, EmbedBuilder, GuildMember, Message } from 'discord.js';
import actions from '../misc/actions.json';

let current: number;

export default async function action(message: Message | CommandInteraction, author: GuildMember, args: string[], type: keyof typeof actions) {
  // Check if arg is a user and set it
  let user;
  if (args.length) {
    user = message.guild?.members.cache.get(args[0].replace(/\D/g, ''));
    if (user) args[0] = user.displayName;
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
    .setAuthor({ name: `${author.displayName} ${actions[type].plural} ${args[0] ? args.join(' ') : ''}`, iconURL: author.user.displayAvatarURL() })
    .setImage(actions[type].gifs[i])
    .setFooter({ text: actions[type].footer });

  // Reply with bonk message, if user is set then mention the user
  if (message.member?.user.id == message.client.user.id && message instanceof Message) {
    message.delete();
    message.channel.send({ content: user ? `${user}` : undefined, embeds: [BonkEmbed], components: [] });
    return;
  }
  else { message.reply({ content: user ? `${user}` : undefined, embeds: [BonkEmbed] }); }
}