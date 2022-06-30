function capFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { left, right } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'settings',
	description: 'Configure this server\' Cactie settings',
	aliases: ['setting', 'dashboard'],
	async execute(message, args, client, lang) {
		try {
			// Get the settings descriptions
			const desc = require(`../../../lang/${lang.language.name}/settingsdesc.json`);

			// Create Embed with title and color
			const SettingsEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Bot Settings');

			// Get settings and make an array out of it to split and make pages
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			let configlist = Object.keys(srvconfig).slice(0, 5).map(prop => { return `**${capFirstLetter(prop)}**\n${desc[prop]}\n\`${srvconfig[prop]}\``; });
			const maxPages = Math.ceil(Object.keys(srvconfig).length / 5);

			// Set embed description with page and stuff
			SettingsEmbed.setDescription(configlist.join('\n'))
				.addFields([{ name: 'How do I change these values?', value: 'Click the dashboard button below!' }])
				.setFooter({ text: lang.page.replace('{1}', '1').replace('{2}', maxPages) });

			// Add buttons for page changing
			const pages = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('page_prev')
						.setEmoji({ id: left })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('page_next')
						.setEmoji({ id: right })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setURL(`https://${client.user.username.replace(' ', '').toLowerCase()}.smhsmh.club/dashboard/${message.guild.id}`)
						.setLabel(lang.dashboard.name)
						.setStyle(ButtonStyle.Link),
				]);

			const SettingsMsg = await message.reply({ embeds: [SettingsEmbed], components: [pages] });
			const filter = i => i.customId.startsWith('page_');
			const collector = SettingsMsg.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async interaction => {
				// Defer interaction
				interaction.deferUpdate();
				let page = parseInt(SettingsEmbed.toJSON().footer ? SettingsEmbed.toJSON().footer.text.split(' ')[1] : maxPages);
				if (interaction.customId == 'page_prev') page = page - 1 ? page - 1 : maxPages;
				else if (interaction.customId == 'page_next') page = page + 1 == maxPages + 1 ? 1 : page + 1;
				const end = page * 5;
				const start = end - 5;

				configlist = Object.keys(srvconfig).slice(start, end).map(prop => { return `**${capFirstLetter(prop)}**\n${desc[prop]}\n\`${srvconfig[prop]}\``; });

				// Update embed description with new page and reply
				SettingsEmbed.setDescription(configlist.join('\n'))
					.setFooter({ text: `Page ${page} of ${maxPages}` });
				SettingsMsg.edit({ embeds: [SettingsEmbed] });
			});

			// When the collector stops, delete the message
			collector.on('end', () => {
				SettingsMsg.delete().catch(err => client.logger.error(err));
				if (!message.commandName) message.delete().catch(err => client.logger.warn(err));
			});
		}
		catch (err) { client.error(err, message); }
	},
};