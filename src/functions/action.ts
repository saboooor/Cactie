import { ChatInputCommandInteraction, StringSelectMenuInteraction, ContainerBuilder, MessageFlags, GuildMember } from 'discord.js';
import actions from '~/misc/actions.json';

let current: number;

export default async function action(interaction: StringSelectMenuInteraction<'cached'> | ChatInputCommandInteraction, target: string | null, type: keyof typeof actions) {
  // Check if arg is a user and set it
  let user: GuildMember | undefined;
  if (target) {
    user = interaction.guild?.members.cache.get(target.replace(/\D/g, ''));
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

  const Title = `${interaction.user} ${actions[type].plural} ${user ?? target}`;

  const ActionContainer = new ContainerBuilder()
    .addSectionComponents((section) => section
      .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(`# ${Title}`),
      )
      .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(actions[type].footer),
      )
      .setThumbnailAccessory((thumb) => thumb
        .setURL(actions[type].gifs[i]!),
      ),
    );

  // Reply with message
  if (interaction instanceof StringSelectMenuInteraction) {
    interaction.message.delete();
    interaction.message.channel.send({
      components: [ActionContainer],
      flags: MessageFlags.IsComponentsV2,
    });
    return;
  }
  interaction.reply({
    components: [ActionContainer],
    flags: MessageFlags.IsComponentsV2,
  });
}