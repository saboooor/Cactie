const Discord = require('discord.js');
const nodeactyl = require('nodeactyl');
const fetch = require('node-fetch');
const Client = nodeactyl.Client;
const { apikey, apikey2 } = require('../config/pterodactyl.json');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
module.exports = async (client, message) => {
	if (message.webhookID && message.channel.id == '812082273393704960') {
		if (client.user.username == 'Pup Dev') {
			if (!message.embeds[0].title.includes('dev')) return;
			message.reply({ content: 'Updating to latest commit...' });
			Client.login('https://panel.discordbothosting.com', apikey2, (logged_in, err) => {
				if (logged_in == false) return message.reply({ content: `Something went wrong, please use https://panel.discordbothosting.com\n${err}` });
			});
			Client.restartServer('b04dbb8c').catch();
			Client.killServer('b04dbb8c').catch();
		}
		else if (client.user.username == 'Pup') {
			if (!message.embeds[0].title.includes('master')) return;
			message.reply({ content: 'Updating to latest commit...' });
			Client.login('https://panel.birdflop.com', apikey, (logged_in, err) => {
				if (logged_in == false) return message.reply({ content: `Something went wrong, please use https://panel.birdflop.com\n${err}` });
			});
			Client.restartServer('5bcaad8d').catch();
			Client.killServer('5bcaad8d').catch();
		}
	}
	if (message.author.bot) return;
	if (message.channel.type == 'dm') {
		if (message.content.startsWith('-')) return message.reply({ content: 'You can only execute dash (-) commands in a Discord Server!\nTry using slash (/) commands instead' });
		if (message.attachments.size == 1) {
			const picture = message.attachments.first();
			const attachmenturl = picture.attachment;
			const response = await fetch(attachmenturl, {
				method: 'GET',
			});
			const buffer = await response.buffer();
			return client.channels.cache.get('849453797809455125').send({ content: `**<@!${message.author.id}>** > ${message.content}`, attachments: [new Discord.MessageAttachment(buffer, 'image.png')] });
		}
		return client.channels.cache.get('849453797809455125').send({ content: `**<@!${message.author.id}>** > ${message.content}` });
	}
	const srvconfig = client.settings.get(message.guild.id);
	if (message.content.startsWith('**Online players (') || message.content.includes('PLAYERS ONLINE**')) client.response.get('list').execute(message);
	if (['lov', 'simp', ' ily ', ' ily', ' babe ', 'babe ', ' babe', 'kiss', 'daddy', 'mommy', 'cute'].some(word => message.content.toLowerCase().includes(word))) {
		if (srvconfig.simpreaction == 'false') return;
		client.response.get('simp').execute(message);
	}
	if (message.content.toLowerCase().includes('what') && message.content.toLowerCase().includes('ip')) client.response.get('whatip').execute(message);
	if (message.content.toLowerCase().includes('pup') && ['bad', 'gross', 'shit', 'dum'].some(word => message.content.toLowerCase().includes(word))) {
		if (srvconfig.simpreaction == 'false') return;
		client.response.get('pupbad').execute(message);
	}
	if (message.content.includes(client.user.id)) {
		message.reply({ content: `My prefix is \`${srvconfig.prefix}\`` });
	}
	if (!message.content.startsWith(srvconfig.prefix)) {
		if (message.channel.name.includes('ticket-')) {
			if (!message.channel.topic) return;
			if (!message.channel.topic.includes('Ticket Opened by')) return;
			if (client.tickets.get(message.channel.id).resolved != 'true') return;
			client.tickets.set(message.channel.id, 'false', 'resolved');
			client.logger.info(`Unmarked ticket #${message.channel.name} as resolved`);
		}
		return;
	}

	const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1200;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		const random = Math.floor(Math.random() * 4);
		const messages = ['Do I look like Usain Bolt to u?', 'BRUH IM JUST A DOG SLOW DOWN', 'can u not', 'leave me alone ;-;'];
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			if ((expirationTime - now) < 1200) return message.react('⏱️');
			const Embed = new Discord.MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return message.reply({ embeds: [Embed] });
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	if (command.args && args.length < 1) {
		const Usage = new Discord.MessageEmbed()
			.setColor(3447003)
			.setTitle('Usage')
			.setDescription(`\`${srvconfig.prefix + command.name + ' ' + command.usage}\``);
		return message.reply({ embeds: [Usage] });
	}

	if (command.permissions && message.author.id !== '249638347306303499') {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (command.permissions == 'ADMINISTRATOR' && client.settings.get(message.guild.id).adminrole != 'permission' && !message.member.roles.cache.has(client.settings.get(message.guild.id).adminrole)) {
			return message.reply({ content: 'You can\'t do that!' });
		}
		else if (!authorPerms && client.settings.get(message.guild.id).adminrole == 'permission' || !authorPerms.has(command.permissions) && client.settings.get(message.guild.id).adminrole == 'permission') {
			return message.reply({ content: 'You can\'t do that!' });
		}
	}

	try {
		client.logger.info(`${message.author.tag} issued dash command: ${message.content}`);
		command.execute(message, args, client);
	}
	catch (error) {
		const interactionFailed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor(message.author.tag, message.author.avatarURL())
			.addField('**Type:**', 'Dash')
			.addField('**Guild:**', message.guild.name)
			.addField('**Channel:**', message.channel.name)
			.addField('**INTERACTION:**', srvconfig.prefix + command.name)
			.addField('**Error:**', clean(error));
		client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
		message.author.send({ embeds: [interactionFailed] });
		client.logger.error(error);
	}
};