const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const modal = require('../../lang/int/settingsmodal.json');
const { left, right, on, off } = require('../../lang/int/emoji.json');
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
	]);
module.exports = async function updateSettingPanel(SettingsEmbed, SettingsMsg, client, srvconfig, desc, newPage) {
	srvconfig = await client.getData('settings', 'guildId', srvconfig.guildId);
	const maxPages = Math.ceil(Object.keys(srvconfig).length / 5);
	let page = parseInt(SettingsEmbed.toJSON().footer ? SettingsEmbed.toJSON().footer.text.split(' ')[1] : maxPages);
	if (newPage == 'prev') page = page - 1 ? page - 1 : maxPages;
	else if (newPage == 'next') page = page + 1 == maxPages + 1 ? 1 : page + 1;
	const end = page * 5;
	const start = end - 5;

	const settingbtns = new ActionRowBuilder();
	const configlist = Object.keys(srvconfig).slice(start, end).map(prop => {
		const btn = new ButtonBuilder()
			.setCustomId(`settings_prop_${prop}`)
			.setLabel(prop)
			.setStyle(ButtonStyle.Secondary);
		if (modal[prop] && modal[prop].type == 'bool') {
			btn.setStyle(srvconfig[prop] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
				.setEmoji({ id: srvconfig[prop] == 'false' ? off : on });
		}
		if (prop == 'guildId') btn.setStyle(ButtonStyle.Danger).setLabel('Reset');
		settingbtns.addComponents([btn]);
		return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
	});

	// Update embed description with new page and reply
	SettingsEmbed.setDescription(configlist.join('\n'));
	if (newPage) SettingsEmbed.setFooter({ text: `Page ${page} of ${maxPages}` });
	SettingsMsg.edit({ embeds: [SettingsEmbed], components: [settingbtns, pages] });
};