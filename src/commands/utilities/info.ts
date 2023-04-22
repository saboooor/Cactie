import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommand } from 'types/Objects';

export const info: SlashCommand = {
  name: 'info',
  description: 'Get various information about Cactie',
  aliases: ['information'],
  cooldown: 10,
  async execute(message, args, client) {
    try {
      const packageJSON = require('../../../package.json');
	  const dependencies = {
		...packageJSON.dependencies,
		...packageJSON.devDependencies,
	  }
      const InfEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(client.user!.username)
        .setDescription(`\`\`\`${packageJSON.description}\`\`\``)
        .setFields([
          { name: 'Bot Version', value: `\`\`\`${packageJSON.version}\`\`\``, inline: true },
          { name: 'NodeJS Version', value: `\`\`\`${process.version}\`\`\``, inline: true },
          { name: 'Developer', value: `\`\`\`${packageJSON.author} | @${client.users.cache.get('249638347306303499')!.tag}\`\`\`` },
          { name: 'Last restart', value: `<t:${Math.ceil(Number(rn) / 1000)}:R>` },
		  { name: 'Dependencies', value: `\`\`\`${Object.keys(dependencies).map(depName => `${depName}: ${dependencies[depName]}`).join('\n')}\`\`\`` },
        ]);
      const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL(`https://${client.user!.username.toLowerCase().replace(/ /g, '')}.luminescent.dev/invite`)
            .setLabel('Invite Cactie!')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL('https://luminescent.dev/discord')
            .setLabel('Join the Cactie Server!')
            .setStyle(ButtonStyle.Link),
          new ButtonBuilder()
            .setURL(`https://${client.user!.username.toLowerCase().replace(/ /g, '')}.luminescent.dev`)
            .setLabel('Open the Dashboard!')
            .setStyle(ButtonStyle.Link),
        ]);
      const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setURL('https://netherdepths.com')
            .setLabel('Also check out Nether Depths!')
            .setStyle(ButtonStyle.Link),
        ]);
      await message.reply({ embeds: [InfEmbed], components: [row1, row2] });
    }
    catch (err) { error(err, message); }
  },
};