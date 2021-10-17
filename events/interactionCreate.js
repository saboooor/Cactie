const { MessageEmbed, Collection } = require('discord.js');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
module.exports = async (client, interaction) => {
	if (interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);
		if (!button) return;

		if (button.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(button.permissions)) {
				interaction.deferUpdate();
				return interaction.user.send({ content: 'You can\'t do that!' }).catch(e => { client.logger.warn(e); });
			}
		}

		try {
			client.logger.info(`${interaction.user.tag} clicked button: ${button.name}, in ${interaction.guild.name}`);
			button.execute(interaction, client);
		}
		catch (error) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
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

		if (dropdown.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(dropdown.permissions)) {
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
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
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

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1200;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			const random = Math.floor(Math.random() * 4);
			const messages = ['Do I look like Usain Bolt to u?', 'BRUH IM JUST A DOG SLOW DOWN', 'can u not', 'leave me alone ;-;'];
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

		if (!interaction.guild && command.guildOnly) {
			return interaction.reply({ content: 'You can only execute this command in a Discord Server!', ephemeral: true });
		}

		if (command.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return interaction.reply({ content: 'You can\'t do that!', ephemeral: true });
			}
		}

		const embed = new MessageEmbed()
			.setColor('RED');

		const player = client.manager.get(interaction.guild.id);

		if (command.player && (!player || !player.queue.current)) {
			embed.setDescription('There is no music playing.');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (command.inVoiceChannel && !interaction.member.voice.channel) {
			embed.setDescription('You must be in a voice channel!');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (command.sameVoiceChannel && interaction.member.voice.channel !== interaction.guild.me.voice.channel) {
			embed.setDescription(`You must be in the same channel as ${client.user}!`);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const srvconfig = client.settings.get(interaction.guild.id);

		if (command.djRole && srvconfig.djrole != 'false') {
			const role = interaction.guild.roles.cache.get(srvconfig.djrole);
			if (!role) return interaction.reply({ content: 'Error: The DJ role can\'t be found!', ephemeral: true });
			if (!interaction.member.roles.cache.has(srvconfig.djrole)) {
				embed.setDescription(`You need the ${role} role to do that!`);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		try {
			client.logger.info(`${interaction.user.tag} issued slash command: /${command.name} ${args.join(' ')}, in ${interaction.guild.name}`);
			command.execute(interaction, args, client);
		}
		catch (error) {
			const interactionFailed = new MessageEmbed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('INTERACTION FAILED')
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
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