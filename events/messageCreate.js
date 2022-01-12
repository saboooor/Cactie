const { MessageAttachment, MessageEmbed, Collection } = require('discord.js');
const { NodeactylClient } = require('nodeactyl');
const fetch = require('node-fetch');
const { createPaste } = require('hastebin');
const servers = require('../config/pterodactyl.json');
function clean(text) {
	if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = async (client, message) => {
	const embed = message.embeds[0];
	if (message.webhookId && message.channel.id == '812082273393704960' && embed) {
		let server = null;
		if (embed.title.startsWith('[Pup:master]') && servers['pup'].client) server = servers['pup'];
		else if (embed.title.startsWith('[Pup:dev]') && servers['pup dev'].client) server = servers['pup dev'];
		if (server && !server.client) return;
		if (!server) return;
		await client.manager.players.forEach(async player => {
			embed.setAuthor({ name: 'Pup is updating and will restart in 5sec! Sorry for the inconvenience!' })
				.setFooter({ text: 'You\'ll be able to play music again in about 10sec!' });
			await client.channels.cache.get(player.textChannel).send({ embeds: [embed] });
		});
		await message.reply({ content: 'Updating to latest commit...' });
		await sleep(5000);
		const Client = new NodeactylClient(server.url, server.apikey);
		await Client.restartServer(server.id);
	}
	if (message.author.bot) return;
	if (message.channel.type == 'DM') {
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

	const srvconfig = await client.getData('settings', 'guildId', message.guild.id);

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
			.setAuthor({ name: message.member.displayName, iconURL: message.member.user.avatarURL({ dynamic : true }) })
			.setDescription(link)
			.setFooter({ text: 'Next time please use a paste service' });
		message.channel.send({ embeds: [Embed] });
	}

	if (!message.content.startsWith(srvconfig.prefix)) {
		// Check if channel is a ticket
		const ticketData = (await client.query(`SELECT * FROM ticketdata WHERE channelId = '${message.channel.id}'`))[0];
		if (ticketData && ticketData.resolved == 'true') {
			await client.setData('ticketdata', 'channelId', message.channel.id, 'resolved', 'false');
			client.logger.info(`Unresolved #${message.channel.name}`);
		}
		return;
	}

	const args = message.content.slice(srvconfig.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command || !command.name) return;

	if (!message.guild.me.permissions.has('SEND_MESSAGES') || !message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES')) {
		client.logger.error(`Missing Message permission in #${message.channel.name} at ${message.guild.name}`);
		message.author.send(`I can't speak in ${message.channel}!`).catch(e => { client.logger.warn(e); });
		return;
	}

	message.channel.sendTyping();
	await sleep(500);
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
			if ((expirationTime - now) < 1200) return message.react('⏱️').catch(e => { client.logger.error(e); });
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
		if (command.similarcmds) Usage.setFooter({ text: `Did you mean to use ${srvconfig.prefix}${command.similarcmds}?` });
		return message.reply({ embeds: [Usage] });
	}

	if (command.permissions && message.author.id !== '249638347306303499') {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (command.permissions == 'ADMINISTRATOR' && srvconfig.adminrole != 'permission' && !message.member.roles.cache.has(srvconfig.adminrole)) {
			return message.reply({ content: `You can't do that, you need the ${message.guild.roles.cache.get(srvconfig.adminrole).name} role!` });
		}
		else if (!authorPerms && srvconfig.adminrole == 'permission' || !authorPerms.has(command.permissions) && srvconfig.adminrole == 'permission') {
			return message.reply({ content: `You can't do that! You need the ${command.permissions} permission!` });
		}
	}

	if (command.botperms && (!message.guild.me.permissions.has(command.botperms) || !message.guild.me.permissionsIn(message.channel).has(command.botperms))) {
		client.logger.error(`Missing ${command.botperms} permission in #${message.channel.name} at ${message.guild.name}`);
		message.reply({ content: `I don't have the ${command.botperms} permission!` });
		return;
	}

	const errEmbed = new MessageEmbed()
		.setColor('RED');

	const player = client.manager.get(message.guild.id);

	if (command.player && (!player || !player.queue.current)) {
		errEmbed.setDescription('There is no music playing.');
		return message.reply({ embeds: [errEmbed] });
	}

	if (command.serverUnmute && message.guild.me.voice.serverMute) {
		errEmbed.setDescription('I\'m server muted!');
		return message.reply({ embeds: [errEmbed] });
	}

	if (command.inVoiceChannel && !message.member.voice.channel) {
		errEmbed.setDescription('You must be in a voice channel!');
		return message.reply({ embeds: [errEmbed] });
	}

	if (command.sameVoiceChannel && message.member.voice.channel !== message.guild.me.voice.channel) {
		errEmbed.setDescription(`You must be in the same channel as ${client.user}!`);
		return message.reply({ embeds: [errEmbed] });
	}

	if (command.djRole && srvconfig.djrole != 'false') {
		const role = message.guild.roles.cache.get(srvconfig.djrole);
		if (!role) return message.reply({ content: 'Error: The DJ role can\'t be found!' });
		if (!message.member.roles.cache.has(srvconfig.djrole)) {
			errEmbed.setDescription(`You need the ${role} role to do that!`);
			return message.reply({ embeds: [errEmbed] });
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
			.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic : true }) })
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