function capFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { on, off } = require('../../lang/int/emoji.json');
const modal = require('../../lang/int/settingsmodal.json');
const updateSettingPanel = require('./updateSettingPanel.js');
module.exports = async function evalModal(client, interaction, setting, srvconfig, SettingsEmbed, SettingsMsg, desc) {
	if (setting == 'guildId') {
		// Create and show a modal for the user to confirm reset
		const propModal = new ModalBuilder()
			.setTitle('Reset all settings')
			.setCustomId('settings_reset')
			.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('confirm')
						.setLabel('Do you really want to reset all settings?')
						.setPlaceholder('Yes, I want to reset all settings')
						.setStyle(TextInputStyle.Short)
						.setMinLength(33)
						.setMaxLength(33),
				),
			);
		interaction.showModal(propModal);
	}
	if (!modal[setting]) return;
	if (modal[setting].type == 'text') {
		// Create and show a modal for the user to fill out the settings's value
		const propModal = new ModalBuilder()
			.setTitle(`Set the new value for ${setting}`)
			.setCustomId('settings_prop')
			.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId(setting)
						.setLabel(setting)
						.setValue(`${srvconfig[setting]}`)
						.setPlaceholder(modal[setting].placeholder)
						.setStyle(TextInputStyle[modal[setting].style])
						.setMinLength(modal[setting].min)
						.setMaxLength(modal[setting].max),
				),
			);
		interaction.showModal(propModal);
	}
	else if (modal[setting].type == 'bool') {
		if (!interaction.customId) {
			const row = new ActionRowBuilder();
			const btn = new ButtonBuilder()
				.setCustomId(`settings_prop_${setting}`)
				.setLabel(capFirstLetter(setting))
				.setStyle(srvconfig[setting] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
				.setEmoji({ id: srvconfig[setting] == 'false' ? off : on });
			row.addComponents(btn);
			const msg = await SettingsMsg.reply({ content: '\u200b', components: [row] });
			const filter = i => i.customId.startsWith('settings_') && i.user.id == interaction.member.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
			collector.on('collect', async btnint => {
				const value = srvconfig[setting] == 'false' ? 'true' : 'false';
				await client.setData('settings', 'guildId', srvconfig.guildId, setting, value);
				client.logger.info(`Successfully set ${setting} to ${value} in ${interaction.guild.name}`);
				srvconfig = await client.getData('settings', 'guildId', srvconfig.guildId);
				btn.setStyle(srvconfig[setting] == 'false' ? ButtonStyle.Danger : ButtonStyle.Success)
					.setEmoji({ id: srvconfig[setting] == 'false' ? off : on });
				msg.edit({ content: '\u200b', components: [row] });
				btnint.deferUpdate();
			});
			// When the collector stops, delete the message
			collector.on('end', () => {
				msg.delete();
			});
			return;
		}
		interaction.deferUpdate();
		const value = srvconfig[setting] == 'false' ? 'true' : 'false';
		await client.setData('settings', 'guildId', srvconfig.guildId, setting, value);
		client.logger.info(`Successfully set ${setting} to ${value} in ${interaction.guild.name}`);
		updateSettingPanel(SettingsEmbed, SettingsMsg, client, srvconfig, desc);
	}
	else if (modal[setting].type == 'select') {
		if (interaction.customId) interaction.deferUpdate();
		const menu = new SelectMenuBuilder()
			.setCustomId(`settings_menu_${setting}`)
			.setPlaceholder(`Select a new value for ${setting}`);
		modal[setting].options.forEach(option => {
			menu.addOptions(
				new SelectMenuOptionBuilder()
					.setLabel(option)
					.setValue(option),
			);
		});
		const row = new ActionRowBuilder().addComponents(menu);
		const menuMsg = await SettingsMsg.reply({ content: '\u200b', components: [row] });
		const filter = i => i.user.id == interaction.member.id;
		const menuCollector = menuMsg.createMessageComponentCollector({ filter, time: 60000 });
		menuCollector.on('collect', async menuint => {
			await client.setData('settings', 'guildId', srvconfig.guildId, setting, menuint.values[0]);
			client.logger.info(`Successfully set ${setting} to ${menuint.values[0]} in ${interaction.guild.name}`);
			row.components[0].options.forEach(option => option.setDefault(option.toJSON().value == menuint.values[0]));
			menuMsg.edit({ content: `**Successfully set ${setting} to \`${menuint.values[0]}\`!**`, components: [row] });
			updateSettingPanel(SettingsEmbed, SettingsMsg, client, srvconfig, desc);
			menuint.deferUpdate();
		});
		menuCollector.on('end', () => {
			if (menuMsg.content != '\u200b') menuMsg.delete();
			else menuMsg.edit({ components: [] });
		});
	}
	else if (modal[setting].type == 'id') {
		if (interaction.customId) interaction.deferUpdate();
		const idMsg = await SettingsMsg.reply({ content: `**Reply to this message with a ${modal[setting].from.replace('s', '')}!** (You may also put an Id)\nReply with 'false' to disable this setting.${modal[setting].additional ? `\n\n**You may also set this setting to either of these other options:**\n\`${modal[setting].additional.join(', ')}\`` : ''}` });
		const filter = m => m.reference && m.reference.messageId == idMsg.id && m.member.id == interaction.member.id;
		const idcollector = idMsg.channel.createMessageCollector({ filter, time: 60000 });
		idcollector.on('collect', async msg => {
			const obj = msg.guild[modal[setting].from].cache.get(msg.content.replace(/\D/g, ''));
			if (!obj && msg.content != 'false' && (modal[setting].additional ? !modal[setting].additional.some(word => msg.content == word) : true)) return msg.reply({ content: `**That is not a valid ${modal[setting].from.replace('s', '')} or option!**` });
			let val = msg.content;
			if (obj) val = obj.id;
			await client.setData('settings', 'guildId', srvconfig.guildId, setting, val);
			client.logger.info(`Successfully set ${setting} to ${val} in ${interaction.guild.name}`);
			msg.reply({ content: `**Successfully set ${setting} to \`${obj ? `${obj.name} (Id: ${obj.id})` : val}\`!**` });
			updateSettingPanel(SettingsEmbed, SettingsMsg, client, srvconfig, desc);
			idcollector.stop();
		});
		idcollector.on('end', () => idMsg.delete());
	}
};