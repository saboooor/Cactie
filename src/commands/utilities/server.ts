import { ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ContainerBuilder, MessageFlags } from 'discord.js';
import { getUserInfo } from '~/util/misc/userinfo';
import { UserRound } from '~/dict/emoji';
import { Command } from '~/lists/Objects';

export const server: Command<'cached'> = {
  description: 'Discord server info',
  cooldown: 10,
  async execute(interaction) {
    try {
      const guild = interaction.guild;
      const owner = await guild.fetchOwner();
      const createdTimestamp = Math.round(guild.createdTimestamp / 1000);

      const ServerInfoContainer = new ContainerBuilder()
        .addSectionComponents(section => section
          .addTextDisplayComponents(
            textDisplay => textDisplay
              .setContent(`# ${guild.name}${
                guild.description ? `\n${guild.description}` : ''
              }${
                guild.vanityURLCode ? `\n-# discord.gg/${guild.vanityURLCode}` : ''
              }`),
            textDisplay => textDisplay
              .setContent(`**Created At**\n<t:${createdTimestamp}>\n<t:${createdTimestamp}:R>`),
          )
          .setThumbnailAccessory(thumbnail => thumbnail.setURL(
            guild.iconURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
          ),
        )
        .addSeparatorComponents(separator => separator)
        .addSectionComponents(section => section
          .addTextDisplayComponents(textDisplay => textDisplay
            .setContent(`## Owner\n${owner}`),
          )
          .setThumbnailAccessory(thumbnail => thumbnail.setURL(
            owner.displayAvatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'),
          ),
        )
        .addActionRowComponents(actionRow => actionRow
          .addComponents(
            new ButtonBuilder()
              .setCustomId('user_info')
              .setEmoji({ id: UserRound.id })
              .setLabel('User Info')
              .setStyle(ButtonStyle.Secondary),
          ),
        )
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(
          textDisplay => textDisplay
            .setContent(`**Members**\n${interaction.guild.memberCount}`),
          textDisplay => textDisplay
            .setContent(`**Channels**\n${interaction.guild.channels.cache.size}`),
        );

      const srvInfoMsg = await interaction.reply({ components: [ServerInfoContainer], flags: [MessageFlags.IsComponentsV2], allowedMentions: { parse: [] } });

      const filter = (i: ButtonInteraction) => i.customId === 'user_info';
      const collector = srvInfoMsg.createMessageComponentCollector<ComponentType.Button>({ filter, time: 60000 });
      collector.on('collect', async (i) => {
        getUserInfo(owner.user, i, owner);
        collector.stop();
      });

      collector.on('end', async () => {
        ServerInfoContainer.spliceComponents(3, 1);
        await interaction.editReply({ components: [ServerInfoContainer], flags: [MessageFlags.IsComponentsV2], allowedMentions: { parse: [] } });
      });
    }
    catch (err) { error(err, interaction); }
  },
};