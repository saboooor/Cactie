import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommand } from '~/types/Objects';
// @ts-ignore
import packageJSON from '../../../package.json' assert { type: 'json' };

export const info: SlashCommand = {
  description: 'Get various information about Cactie',
  cooldown: 10,
  async execute(interaction, client) {
    try {
      const dependencies = {
        ...packageJSON.dependencies,
        ...packageJSON.devDependencies,
      };
      const InfEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(client.user.username)
        .setDescription(`\`\`\`${packageJSON.description}\`\`\``)
        .setFields([
          { name: 'Bot Version', value: `\`\`\`${packageJSON.version}\`\`\``, inline: true },
          { name: 'NodeJS Version', value: `\`\`\`${process.version}\`\`\``, inline: true },
          { name: 'Developer', value: `\`\`\`${packageJSON.author} | @${client.users.cache.get('249638347306303499')!.username}\`\`\`` },
          { name: 'Last restart', value: `<t:${Math.ceil(Number(rn) / 1000)}:R>` },
          { name: 'Dependencies', value: `\`\`\`${Object.keys(dependencies).map(depName => `${depName}: ${dependencies[depName as keyof typeof dependencies]}`).join('\n')}\`\`\`` },
        ]);
      const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL('https://cactie.luminescent.dev/invite')
            .setLabel('Invite Cactie!')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://luminescent.dev/discord')
            .setLabel('Join the LuminescentDev Server!')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://cactie.luminescent.dev')
            .setLabel('Open the Dashboard!')
            .setStyle(ButtonStyle.Link),
        ]);
      await interaction.reply({ embeds: [InfEmbed], components: [row1] });
    }
    catch (err) { error(err, interaction); }
  },
};