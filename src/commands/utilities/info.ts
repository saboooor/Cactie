import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags } from 'discord.js';
import { Command } from '~/types/Objects';
import packageJSON from '../../../package.json';
import { lastStarted } from '~/index';

export const info: Command = {
  description: 'Get various information about Sova',
  cooldown: 10,
  async execute(interaction, client) {
    try {
      const dependencies = {
        ...packageJSON.dependencies,
        ...packageJSON.devDependencies,
      };

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL('https://sova.fyi/invite')
            .setLabel('Invite Sova!')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://sova.fyi/discord')
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://sova.fyi')
            .setLabel('Dashboard')
            .setStyle(ButtonStyle.Link),
        ]);

      const InfoContainer = new ContainerBuilder()
        .addSectionComponents(section => section
          .addTextDisplayComponents(text => text
            .setContent(`# ${client.user.username}\n\`\`\`${packageJSON.description}\`\`\``),
          )
          .setThumbnailAccessory(thumb => thumb.setURL(client.user.displayAvatarURL({ size: 4096 }))),
        )
        .addSeparatorComponents(separator => separator)
        .addTextDisplayComponents(
          text => text
            .setContent(`**Bot Version**\n\`\`\`${packageJSON.version}\`\`\``),
          text => text
            .setContent(`**Bun Version**\n\`\`\`${process.versions.bun}\`\`\``),
          text => text
            .setContent(`**Developer**\n\`\`\`${packageJSON.author} | @${client.users.cache.get('249638347306303499')!.username}\`\`\``),
          text => text
            .setContent(`**Last restart**\n<t:${Math.ceil(Number(lastStarted) / 1000)}:R>`),
          text => text
            .setContent(`**Dependencies**\n\`\`\`${Object.keys(dependencies).map(depName => `${depName}: ${dependencies[depName as keyof typeof dependencies]}`).join('\n')}\`\`\``),
        )
        .addActionRowComponents(row);

      await interaction.reply({ components: [InfoContainer], flags: MessageFlags.IsComponentsV2 });
    }
    catch (err) { error(err, interaction); }
  },
};