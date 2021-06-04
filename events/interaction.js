const Discord = require('discord.js');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
module.exports = (client, interaction) => {
	if (interaction.isMessageComponent()) {
		const button = client.buttons.get(interaction.customID);
		if (!button) return;
		try { button.execute(interaction, client); }
		catch (error) { client.logger.log('error', error); }
	}
	else if (interaction.isCommand()) {
		const command = client.slashcommands.get(interaction.commandName);
		const args = interaction.options;
		if (!command) return;

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			const random = Math.floor(Math.random() * 4);
			const messages = ['Do I look like Usain Bolt to u?', 'BRUH IM JUST A DOG SLOW DOWN', 'can u not', 'leave me alone ;-;'];
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const Embed = new Discord.MessageEmbed()
					.setColor(Math.round(Math.random() * 16777215))
					.setTitle(messages[random])
					.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
				return interaction.reply(Embed);
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		const commandLogEmbed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Command executed!')
			.setAuthor(interaction.user.tag, interaction.user.avatarURL())
			.addField('**Type:**', 'Slash');

		if (interaction.guild) {
			commandLogEmbed.addField('**Guild:**', interaction.guild.name).addField('**Channel:**', interaction.channel.name);
		}
		else if (command.guildOnly) {
			return interaction.reply('You can only execute this command in a Discord Server!');
		}

		commandLogEmbed.addField('**Command:**', command.name);

		if (command.permissions && interaction.user.id !== '249638347306303499') {
			const authorPerms = interaction.member.permissions;
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return interaction.reply('You can\'t do that!');
			}
		}

		try {
			client.logger.log('info', `${interaction.user.tag} issued slash command: /${command.name}`);
			client.users.cache.get('249638347306303499').send(commandLogEmbed);
			command.execute(interaction, args, client);
		}
		catch (error) {
			commandLogEmbed.setTitle('COMMAND FAILED').addField('**Error:**', clean(error));
			client.users.cache.get('249638347306303499').send(commandLogEmbed);
			client.logger.log('error', error);
		}
	}
};