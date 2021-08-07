const Discord = require('discord.js');
const nodeactyl = require('nodeactyl');
const fetch = require('node-fetch');
const hastebin = require('hastebin');
const servers = require('../config/pterodactyl.json');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
module.exports = async (client, message) => {
	if (message.webhookId && message.channel.id == '812082273393704960' && message.embeds[0].title.includes('master') && servers['pup'].client == true) {
		message.reply({ content: 'Updating to latest commit...' });
		const server = servers['pup'];
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		Client.restartServer(server.id);
		Client.killServer(server.id);
	}
	else if (message.webhookId && message.channel.id == '812082273393704960' && message.embeds[0].title.includes('dev')) {
		message.reply({ content: 'Updating to latest commit...' });
		const server = servers['pup dev'];
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		Client.restartServer(server.id);
		Client.killServer(server.id);
	}
	if (message.author.bot) return;
	if (message.channel.type == 'DM') {
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

	if (srvconfig.reactions != 'false') {
		client.reactions.forEach(reaction => {
			if (reaction.additionaltriggers && reaction.triggers.some(word => message.content.toLowerCase().includes(word)) && reaction.additionaltriggers.some(word => message.content.toLowerCase().includes(word))) {
				reaction.execute(message);
				client.logger.info(`${message.author.tag} triggered reaction: ${reaction.name}, in ${message.guild.name}`);
			}
			else if (!reaction.additionaltriggers && reaction.triggers.some(word => message.content.toLowerCase().includes(word))) {
				reaction.execute(message);
				client.logger.info(`${message.author.tag} triggered reaction: ${reaction.name}, in ${message.guild.name}`);
			}
		});
	}

	if (message.content.includes(client.user.id)) message.reply({ content: `My prefix is \`${srvconfig.prefix}\`` });

	if (message.content.split('\n').length > srvconfig.msgshortener && srvconfig.msgshortener != '0') {
		message.delete();
		const link = await hastebin.createPaste(message.content, { server: 'https://bin.birdflop.com' });
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Shortened long message')
			.setAuthor(message.member.displayName, message.member.user.avatarURL())
			.setDescription(link)
			.setFooter('Next time please use a paste service');
		message.channel.send({ embeds: [Embed] });
	}

	if (!message.content.startsWith(srvconfig.prefix)) {
		if (client.tickets.get(message.channel.id) && client.tickets.get(message.channel.id).resolved == 'true') {
			client.tickets.set(message.channel.id, 'false', 'resolved');
			client.logger.info(`Unresolved #${message.channel.name}`);
		}
		return;
	}

	const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command || !command.name) return;

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
		const messages = ['Do I look like Usain Bolt to u?', 'BRUH IM JUST A DOG SLOW DOWN', 'can u not', 'leave me alone ;-;', 'my name is pup, not sanic >:(', 'why do you do this to me'];
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
		client.logger.info(`${message.author.tag} issued dash command: ${message.content}, in ${message.guild.name}`);
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
			.addField('**Error:**', `${clean(error)}`);
		client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
		message.author.send({ embeds: [interactionFailed] });
		client.logger.error(error);
	}
};