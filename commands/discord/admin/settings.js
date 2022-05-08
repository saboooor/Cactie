function capFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { left, right, on, off } = require('../../../lang/int/emoji.json');
const modal = require('../../../lang/int/settingsmodal.json');
const evalModal = require('../../../functions/settings/evalModal.js');
const updateSettingPanel = require('../../../functions/settings/updateSettingPanel.js');
const fs = require('fs');
const languages = fs.readdirSync('./lang').filter(folder => folder != 'int');
modal.language.options = languages;
module.exports = {
	name: 'settings',
	description: 'Configure Cactie\'s settings in the server',
	aliases: ['setting'],
	usage: '[Option]',
	noDefer: true,
	permission: 'Administrator',
	options: require('../../options/settings.js'),
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
			const settingbtns = new ActionRowBuilder();
			const configlist = Object.keys(srvconfig).slice(0, 5).map(prop => {
				const btn = new ButtonBuilder()
					.setCustomId(`settings_prop_${prop}`)
					.setLabel(capFirstLetter(prop))
					.setStyle(ButtonStyle.Secondary);
				if (modal[prop] && modal[prop].type == 'bool') {
					btn.setStyle(srvconfig[prop] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
						.setEmoji({ id: srvconfig[prop] == 'false' ? off : on });
				}
				if (prop == 'guildId') btn.setStyle(ButtonStyle.Danger).setLabel('Reset');
				settingbtns.addComponents([btn]);
				return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
			});
			const maxPages = Math.ceil(Object.keys(srvconfig).length / 5);

			// Set embed description with page and stuff
			SettingsEmbed.setDescription(configlist.join('\n'))
				.addFields([{ name: 'Usage', value: 'Click the buttons below to edit the specified setting or navigate' }])
				.setFooter({ text: lang.page.replace('{1}', '1').replace('{2}', maxPages) });
			if (client.user.id == '848775888673439745') SettingsEmbed.addFields([{ name: lang.dashboard.confusing, value: lang.dashboard.use }]);

			// Add buttons for page changing
			const pages = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setCustomId('settings_page_prev')
						.setEmoji({ id: left })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('settings_page_next')
						.setEmoji({ id: right })
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setURL('https://cactie.smhsmh.club')
						.setLabel(lang.dashboard.name)
						.setStyle(ButtonStyle.Link),
				]);

			const modalyes = modal[args[0]] && modal[args[0]].type == 'text';
			if (message.commandName) {
				if (args[0] && modalyes || args[0] == 'reset') return evalModal(client, message, args[0], srvconfig, null, null, desc);
				await message.deferReply();
				message.reply = message.editReply;
			}

			const SettingsMsg = await message.reply({ embeds: [SettingsEmbed], components: [settingbtns, pages] });

			if (message.commandName && args[0]) {
				if (!srvconfig[args[0]]) return client.error(`\`${args[0]}\` is an invalid setting!`, message, true);
				evalModal(client, message, args[0], srvconfig, SettingsEmbed, SettingsMsg, desc);
			}

			const filter = i => i.customId.startsWith('settings_') && i.user.id == message.member.id;
			const collector = SettingsMsg.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async interaction => {
				const button = interaction.component.customId.split('_');

				if (button[1] == 'page') {
					// Defer interaction
					interaction.deferUpdate();
					updateSettingPanel(SettingsEmbed, SettingsMsg, client, srvconfig, desc, button[2]);
				}
				else if (button[1] == 'prop') {
					evalModal(client, interaction, button[2], srvconfig, SettingsEmbed, SettingsMsg, desc);
				}
			});

			// When the collector stops, delete the message
			collector.on('end', () => {
				SettingsMsg.delete().catch(err => client.logger.error(err.stack));
				if (!message.commandName) message.delete().catch(err => client.logger.error(err.stack));
			});
		}
		catch (err) { client.error(err, message); }
	},
};