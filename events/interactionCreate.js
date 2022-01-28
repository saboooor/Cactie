const { MessageEmbed, Collection, MessageButton, MessageActionRow } = require('discord.js');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
const msg = require('../lang/en/msg.json');
module.exports = async (client, interaction) => {
	if (interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);
		if (!button) return;

		try {
			button.deferReply ? await interaction.deferReply({ ephemeral: button.ephemeral }) : await interaction.deferUpdate({ ephemeral: button.ephemeral });
		}
		catch (e) {
			client.logger.error(e);
		}

		interaction.reply = interaction.editReply;

		if (button.botperm && (!interaction.guild.me.permissions.has(button.botperm) || !interaction.guild.me.permissionsIn(interaction.channel).has(button.botperm))) {
			client.logger.error(`Missing ${button.botperm} permission in #${interaction.channel.name} at ${interaction.guild.name}`);
			return interaction.reply({ content: `I don't have the ${button.botperm} permission!`, ephemeral: true }).catch(e => { client.logger.warn(e); });
		}

		if (button.permission && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(button.permission)) {
				interaction.deferUpdate();
				return interaction.user.send({ content: 'You can\'t do that!' }).catch(e => { client.logger.warn(e); });
			}
		}

		const embed = new MessageEmbed()
			.setColor('RED');

		const player = interaction.guild ? client.manager.get(interaction.guild.id) : null;

		if (button.player && (!player || !player.queue.current)) {
			embed.setTitle('There is no music playing.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (button.serverUnmute && interaction.guild.me.voice.serverMute) {
			embed.setTitle('I\'m server muted!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (button.inVoiceChannel && !interaction.member.voice.channel) {
			embed.setTitle('You must be in a voice channel!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (button.sameVoiceChannel && interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			embed.setTitle(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		try {
			client.logger.info(`${interaction.user.tag} clicked button: ${button.name}, in ${interaction.guild.name}`);
			button.execute(interaction, client);
		}
		catch (error) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic : true }) })
				.addField('**Type:**', 'Button')
				.addField('**Interaction:**', button.name)
				.addField('**Error:**', clean(error));
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(error);
		}
	}
	else if (interaction.isSelectMenu()) {
		const dropdown = client.dropdowns.get(interaction.values[0]);
		if (!dropdown) return;

		if (dropdown.permission && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(dropdown.permission)) {
				interaction.deferUpdate();
				return interaction.user.send({ content: 'You can\'t do that!' }).catch(e => { client.logger.warn(e); });
			}
		}

		try {
			client.logger.info(`${interaction.user.tag} clicked dropdown: ${interaction.values[0]}, in ${interaction.guild.name}`);
			dropdown.execute(interaction, client);
		}
		catch (error) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic : true }) })
				.addField('**Type:**', 'Dropdown')
				.addField('**Interaction:**', interaction.values[0])
				.addField('**Error:**', clean(error));
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(error);
		}
	}
	else if (interaction.isCommand() || interaction.isContextMenu()) {
		const command = client.slashcommands.get(interaction.commandName);
		let args = interaction.isContextMenu() ? client : interaction.options;
		if (interaction.isContextMenu()) {
			const msgs = await interaction.channel.messages.fetch({ around: interaction.targetId, limit: 1 });
			interaction.message = msgs.first();
		}
		else {
			args = interaction.options._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
			if (interaction.options._subcommand) args.unshift(interaction.options._subcommand);
		}
		if (!command) return;

		await interaction.deferReply({ ephemeral: command.ephemeral });
		interaction.reply = interaction.editReply;
		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1200;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			const messages = require('../lang/en/cooldown.json');
			const random = Math.floor(Math.random() * messages.length);
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				if ((expirationTime - now) < 1200) return;
				const Embed = new MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setTitle(messages[random])
					.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
				return interaction.reply({ embeds: [Embed], ephemeral: true });
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		const embed = new MessageEmbed()
			.setColor('RED');

		if (interaction.channel.type == 'DM') {
			embed.setTitle('You can\'t execute commands in DMs!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const srvconfig = await client.getData('settings', 'guildId', interaction.guild.id);

		if (command.voteOnly && client.user.id == '765287593762881616') {
			const vote = await client.getData('lastvoted', 'userId', interaction.member.user.id);
			if (Date.now() > vote.timestamp + 86400000) {
				embed.setTitle(`You need to vote to use ${command.name}! Vote below!`)
					.setDescription('Voting helps us get Pup in more servers!\nIt\'ll only take a few seconds!');
				const row = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setURL('https://top.gg/bot/765287593762881616/vote')
							.setLabel('top.gg')
							.setStyle('LINK'),
					)
					.addComponents(
						new MessageButton()
							.setURL('https://discordbotlist.com/bots/pup/upvote')
							.setLabel('dbl.com')
							.setStyle('LINK'),
					);
				return interaction.reply({ embeds: [embed], components: [row] });
			}
		}

		if (command.permission && interaction.member.user.id !== '249638347306303499') {
			const authorPerms = interaction.channel.permissionsFor(interaction.member.user);
			if (command.permission == 'ADMINISTRATOR' && srvconfig.adminrole != 'permission' && !interaction.member.roles.cache.has(srvconfig.adminrole)) {
				embed.setTitle(msg.rolereq.replace('-r', interaction.guild.roles.cache.get(srvconfig.adminrole).name));
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
			else if (!authorPerms && srvconfig.adminrole == 'permission' || !authorPerms.has(command.permission) && srvconfig.adminrole == 'permission') {
				embed.setTitle(msg.permreq.replace('-p', command.permission));
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		if (command.botperm && (!interaction.guild.me.permissions.has(command.botperm) || !interaction.guild.me.permissionsIn(interaction.channel).has(command.botperm))) {
			client.logger.error(`Missing ${command.botperm} permission in #${interaction.channel.name} at ${interaction.guild.name}`);
			embed.setTitle(`I don't have the ${command.botperm} permission!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const player = interaction.guild ? client.manager.get(interaction.guild.id) : null;

		if (command.player && (!player || !player.queue.current)) {
			embed.setTitle('There is no music playing.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (command.serverUnmute && interaction.guild.me.voice.serverMute) {
			embed.setTitle('I\'m server muted!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			embed.setTitle('You must be in a voice channel!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (command.sameVoiceChannel && interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			embed.setTitle(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (command.djRole && srvconfig.djrole != 'false') {
			const role = interaction.guild.roles.cache.get(srvconfig.djrole);
			if (!role) return interaction.reply({ content: msg.dj.notfound, ephemeral: true });
			if (!interaction.member.roles.cache.has(srvconfig.djrole)) {
				embed.setTitle(msg.rolereq.replace('-r', role.name));
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		try {
			const cmdlog = args.join ? `${command.name} ${args.join(' ')}` : command.name;
			const guild = interaction.guild ? interaction.guild.name : 'DMs';
			client.logger.info(`${interaction.user.tag} issued slash command: /${cmdlog}, in ${guild}`.replace(' ,', ','));
			command.execute(interaction, args, client);
		}
		catch (error) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic : true }) })
				.addField('**Type:**', 'Slash')
				.addField('**Interaction:**', command.name)
				.addField('**Error:**', `${clean(error)}`);
			if (interaction.guild) interactionFailed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
			client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
			interaction.user.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
			client.logger.error(error);
		}
	}
};