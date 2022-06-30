const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = async (client, interaction) => {
	// Check if interaction is context menu
	if (!interaction.isContextMenuCommand()) return;

	// Get the command from the available slash cmds in the bot, if there isn't one, just return because discord will throw an error itself
	const command = client.contextcmds.get(interaction.commandName);
	if (!command) return;

	// Get current settings for the guild
	const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

	// Get the language for the user if specified or guild language
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${interaction.user.id}'`);
	let lang = require('../../../lang/English/msg.json');
	if (interaction.guild.preferredLocale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (interaction.guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../../lang/${srvconfig.language}/msg.json`);
	if (interaction.locale.split('-')[0] == 'en') lang = require('../../../lang/English/msg.json');
	else if (interaction.locale.split('-')[0] == 'pt') lang = require('../../../lang/Portuguese/msg.json');
	if (data[0]) lang = require(`../../../lang/${data[0].language}/msg.json`);

	// Check if user has the permissions necessary to use the command
	if (command.permission) {
		client.logger.info(JSON.stringify(interaction.member.permissions));
		client.logger.info(command.permission);
	}
	if (command.permission
		&& interaction.user.id !== '249638347306303499'
		&& (!interaction.member.permissions
			|| (!interaction.member.permissions.has(PermissionsBitField.Flags[command.permission])
				&& !interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[command.permission])
				&& !interaction.member.roles.cache.has(srvconfig.adminrole)
			)
		)
	) {
		if (command.permission == 'Administrator' && srvconfig.adminrole != 'permission') {
			client.logger.error(`User is missing ${command.permission} permission (${srvconfig.adminrole}) from '${command.name}' in #${interaction.channel.name} at ${interaction.guild.name}`);
			return client.error(lang.rolereq.replace('{role}', interaction.guild.roles.cache.get(srvconfig.adminrole).name), interaction, true);
		}
		else {
			client.logger.error(`User is missing ${command.permission} permission from '${command.name}' in #${interaction.channel.name} at ${interaction.guild.name}`);
			return client.error(lang.permreq.replace('{perm}', command.permission), interaction, true);
		}
	}

	// Check if bot has the permissions necessary to run the command
	if (command.botperm
		&& (!interaction.guild.members.me.permissions
			|| (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags[command.botperm])
				&& !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionsBitField.Flags[command.botperm])
			)
		)) {
		client.logger.error(`Bot is missing ${command.botperm} permission from '${command.name}' in #${interaction.channel.name} at ${interaction.guild.name}`);
		return client.error(`I don't have the ${command.botperm} permission!`, interaction, true);
	}

	// Set item to the command type
	let item;
	if (command.type == 'Message') item = await interaction.channel.messages.fetch(interaction.targetId);
	if (command.type == 'User') item = await interaction.guild.members.fetch(interaction.targetId);

	// Defer and execute the command
	try {
		if (!command.noDefer) {
			await interaction.deferReply({ ephemeral: command.ephemeral });
			interaction.reply = interaction.editReply;
		}
		client.logger.info(`${interaction.user.tag} issued context menu command: '${command.name}', in ${interaction.guild.name}`.replace(' ,', ','));
		command.execute(interaction, client, item, lang);
	}
	catch (err) {
		const interactionFailed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
			.addFields([
				{ name: '**Type:**', value: 'Context Menu' },
				{ name: '**Interaction:**', value: command.name },
				{ name: '**Error:**', value: `\`\`\`\n${err}\n\`\`\`` },
			]);
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [interactionFailed] });
		interaction.user.send({ embeds: [interactionFailed] }).catch(err => client.logger.warn(err));
		client.logger.error(err.stack);
	}
};