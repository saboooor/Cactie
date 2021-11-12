const { MessageAttachment, MessageEmbed, Collection } = require('discord.js');
const { NodeactylClient } = require('nodeactyl');
const fetch = require('node-fetch');
const { createPaste } = require('hastebin');
const servers = require('../config/pterodactyl.json');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
module.exports = async (client, message) => {
	if (message.webhookId && message.channel.id == '812082273393704960' && message.embeds[0].title.includes('master') && servers['pup'].client == true) {
		message.reply({ content: 'Updating to latest commit...' });
		const server = servers['pup'];
		const Client = new NodeactylClient(server.url, server.apikey);
		Client.restartServer(server.id);
	}
	else if (message.webhookId && message.channel.id == '812082273393704960' && message.embeds[0].title.includes('dev') && servers['pup dev'].client == true) {
		message.reply({ content: 'Updating to latest commit...' });
		const server = servers['pup dev'];
		const Client = new NodeactylClient(server.url, server.apikey);
		Client.restartServer(server.id);
	}
	if (message.author.bot) return;
	if (message.channel.type == 'DM') {
		if (message.content.startsWith('-')) return message.reply({ content: 'You can only execute dash (-) commands in a Discord Server!\nTry using slash (/) commands instead' });
		if (message.attachments && message.attachments.size >= 1 && !message.commandName) {
			const files = [];
			await message.attachments.forEach(async attachment => {
				const response = await fetch(attachment.url, {
					method: 'GET',
				});
				const buffer = await response.buffer();
				const img = new MessageAttachment(buffer, `${attachment.id}.${attachment.contentType.split('/')[1]}`);
				files.push(img);
				if (files.length == message.attachments.size) {
					client.channels.cache.get('849453797809455125')
						.send({ content: `**${message.author}** > ${message.content}`, files: files })
						.catch(error => { client.logger.warn(error); });
				}
			});
		}
		return client.channels.cache.get('849453797809455125').send({ content: `**${message.author}** > ${message.content}` });
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
		const link = await createPaste(message.content, { server: 'https://bin.birdflop.com' });
		const Embed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('Shortened long message')
			.setAuthor(message.member.displayName, message.member.user.avatarURL({ dynamic : true }))
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
		cooldowns.set(command.name, new Collection());
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
			const Embed = new MessageEmbed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTitle(messages[random])
				.setDescription(`wait ${timeLeft.toFixed(1)} more seconds before reusing the ${command.name} command.`);
			return message.reply({ embeds: [Embed] });
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	if (command.args && args.length < 1) {
		const Usage = new MessageEmbed()
			.setColor(3447003)
			.setTitle('Usage')
			.setDescription(`\`${srvconfig.prefix + command.name + ' ' + command.usage}\``);
		if (command.similarcmds) Usage.setFooter(`Did you mean to use ${srvconfig.prefix}${command.similarcmds}?`);
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

	const embed = new MessageEmbed()
		.setColor('RED');

	const player = client.manager.get(message.guild.id);

	if (command.player && (!player || !player.queue.current)) {
		embed.setDescription('There is no music playing.');
		return message.reply({ embeds: [embed] });
	}

	if (command.inVoiceChannel && !message.member.voice.channel) {
		embed.setDescription('You must be in a voice channel!');
		return message.reply({ embeds: [embed] });
	}

	if (command.sameVoiceChannel && message.member.voice.channel !== message.guild.me.voice.channel) {
		embed.setDescription(`You must be in the same channel as ${client.user}!`);
		return message.reply({ embeds: [embed] });
	}

	if (command.djRole && srvconfig.djrole != 'false') {
		const role = message.guild.roles.cache.get(srvconfig.djrole);
		if (!role) return message.reply({ content: 'Error: The DJ role can\'t be found!' });
		if (!message.member.roles.cache.has(srvconfig.djrole)) {
			embed.setDescription(`You need the ${role} role to do that!`);
			return message.reply({ embeds: [embed] });
		}
	}

	try {
		client.logger.info(`${message.author.tag} issued dash command: ${message.content}, in ${message.guild.name}`);
		command.execute(message, args, client);
	}
	catch (error) {
		const interactionFailed = new MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('INTERACTION FAILED')
			.setAuthor(message.author.tag, message.author.avatarURL({ dynamic : true }))
			.addField('**Type:**', 'Dash')
			.addField('**Guild:**', message.guild.name)
			.addField('**Channel:**', message.channel.name)
			.addField('**INTERACTION:**', srvconfig.prefix + command.name)
			.addField('**Error:**', `${clean(error)}`);
		client.users.cache.get('249638347306303499').send({ embeds: [interactionFailed] });
		message.author.send({ embeds: [interactionFailed] }).catch(e => { client.logger.warn(e); });
		client.logger.error(error);
	}
};