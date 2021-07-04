const fetch = require('node-fetch');
require('moment-duration-format');
const moment = require('moment');
const hastebin = require('hastebin');
const nodeactyl = require('nodeactyl');
const Client = nodeactyl.Client;
let { apikey } = require('../../config/pterodactyl.json');
const { apikey2 } = require('../../config/pterodactyl.json');
const protocols = require('../../config/mcprotocol.json');
let url = 'https://panel.birdflop.com';
const Discord = require('discord.js');
module.exports = {
	name: 'stats',
	description: 'Get stats of Pup or a Minecraft server',
	aliases: ['status'],
	usage: '[Server]',
	cooldown: 10,
	options: [{
		type: 3,
		name: 'server',
		description: 'Specify a Minecraft server',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		const srvconfig = client.settings.get(message.guild.id);
		const Embed = new Discord.MessageEmbed()
			.setThumbnail('https://bugs.mojang.com/secure/attachment/99116/unknown_pack.png')
			.setColor(3447003);
		let reply = null;
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			await message.defer();
		}
		else {
			reply = await message.reply('<a:loading:826611946258038805> Pup is thinking...');
		}
		let id = '';
		let serverip = '';
		let arg = args.join(' ');
		if (arg) arg = arg.toLowerCase();
		if (srvconfig.adfree == 'true') {
			if (client.user.username == 'Pup') {
				if (arg != 'pup') {
					arg = 'pup';
				}
			}
			else if (client.user.username == 'Pup Dev' || client.user.username == 'Pup Canary') {
				if (arg != 'pup dev') {
					arg = 'pup dev';
				}
			}
			if (message.guild.id == '661736128373719141') {
				arg = 'nether depths';
			}
			else if (message.guild.id == '711661870926397601') {
				arg = 'taco haven';
			}
		}
		if (!arg) {
			if (client.user.username == 'Pup') {
				id = '5bcaad8d';
			}
			else if (client.user.username == 'Pup Dev') {
				id = 'b04dbb8c';
			}
			if (message.guild.id == '661736128373719141') {
				id = '50dc31e4';
				serverip = 'play.netherdepths.com';
			}
			else if (message.guild.id == '711661870926397601') {
				id = 'd68c84e1';
				serverip = 'tacohaven.club';
			}
		}
		else if (arg == 'pup') {
			id = '5bcaad8d';
		}
		else if (arg == 'pup dev') {
			id = 'b04dbb8c';
		}
		else if (arg == 'taco haven') {
			id = 'd68c84e1';
			serverip = 'tacohaven.club';
		}
		else if (arg == 'nether depths') {
			id = '50dc31e4';
			serverip = 'play.netherdepths.com';
		}
		else {
			serverip = args[0];
		}
		if (id !== '') {
			if (id == 'b04dbb8c') {
				url = 'https://panel.discordbothosting.com';
				apikey = apikey2;
			}
			Client.login(url, apikey, (logged_in, err) => {
				if (logged_in == false) return message.reply(`Something went wrong\n${err}`);
			});
			const info = await Client.getServerInfo(id).catch((error) => {client.logger.error(error);});
			const cpu = await Client.getCPUUsage(id).catch((error) => {client.logger.error(error);});
			const ram = await Client.getRAMUsage(id).catch((error) => {client.logger.error(error);});
			const status = await Client.getServerStatus(id).catch((error) => {client.logger.error(error);});
			const statusname = status.replace('running', 'Online').replace('stopping', 'Stopping').replace('offline', 'Offline').replace('starting', 'Starting');
			Embed.setTitle(`${info.attributes.name} (${statusname})`);
			if (status == 'running') Embed.setColor(65280);
			if (status == 'stopping') Embed.setColor(16737280);
			if (status == 'offline') Embed.setColor(16711680);
			if (status == 'starting') Embed.setColor(16737280);
			if (id == 'b04dbb8c') {
				Embed.setTitle('Pup Dev');
				const duration = moment.duration(client.uptime).format('D [days], H [hrs], m [mins], s [secs]');
				if (duration) Embed.addField('**Uptime:**', duration);
				Embed.setThumbnail(reply.author.avatarURL());
			}
			if (id == '5bcaad8d') {
				Embed.setTitle('Pup');
				const duration = moment.duration(client.uptime).format('D [days], H [hrs], m [mins], s [secs]');
				if (duration) Embed.addField('**Uptime:**', duration);
				Embed.setThumbnail(reply.author.avatarURL());
			}
			if (info.attributes.node) Embed.addField('**Node:**', info.attributes.node);
			if (cpu.current) Embed.addField('**CPU Usage:**', cpu.current + '%');
			if (ram.current) Embed.addField('**RAM Usage:**', `${Math.ceil(ram.current / 1000000)} MB`);
		}
		if (serverip !== '') {
			const json = await fetch(`https://api.mcsrvstat.us/2/${serverip}`);
			const pong = await json.json();
			if (id == '') {
				if (pong.hostname) Embed.setTitle(pong.hostname);
				else if (pong.port == 25565) Embed.setTitle(pong.ip);
				else Embed.setTitle(`${pong.ip}:${pong.port}`);
				let noadmsg = '**Server is offline**';
				if (srvconfig.adfree == 'false') noadmsg = '**Invalid Server**\nYou can use any valid Minecraft server IP\nor use an option from the list below:```yml\nPup\nTaco Haven\nNether Depths```';
				if (!pong.online) {
					if (message.type && message.type == 'APPLICATION_COMMAND') {
						return message.editReply(noadmsg);
					}
					else {
						return reply.edit(noadmsg);
					}
				}
			}
			const duration = moment.duration(Date.now() - pong.debug.cachetime * 1000).format('m [mins and] s [secs]');
			Embed.setDescription(`Last Updated: \`${duration} ago\``);
			if (!pong.debug.cachetime) Embed.setDescription('Last Updated: `just now`');
			if (pong.version) Embed.addField('**Version:**', pong.version);
			if (pong.protocol != -1 && pong.protocol) Embed.addField('**Protocol:**', `${pong.protocol} (${protocols[pong.protocol]})`);
			if (pong.software) Embed.addField('**Software:**', pong.software);
			if (pong.players) {
				Embed.addField('**Players Online:**', `${pong.players.online} / ${pong.players.max}`);
				if (pong.players.list) {
					if (pong.players.online > 50) {
						const link = await hastebin.createPaste(pong.players.list.join('\n'), { server: 'https://bin.birdflop.com' });
						Embed.addField('**Players:**', `[Click Here](${link})`);
					}
					else {
						Embed.addField('**Players:**', pong.players.list.join('\n').replace(/_/g, '\\_'));
					}
				}
			}
			if (pong.motd) Embed.addField('**MOTD:**', pong.motd.clean.join('\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥'));
			if (pong.icon) {
				const base64string = Buffer.from(pong.icon.replace(/^data:image\/png;base64,/, ''), 'base64');
				const iconpng = new Discord.MessageAttachment(base64string, 'icon.png');
				Embed.attachFiles([iconpng]).setThumbnail('attachment://icon.png');
			}
			if (pong.plugins) {
				const link = await hastebin.createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
				Embed.addField('**Plugins:**', `[Click Here](${link})`);
			}
			if (!pong.debug.query) {
				if (pong.software == 'Waterfall') Embed.setFooter('Query disabled! If you want to see more information, please contact the owner and tell them to set query_enabled to true and query_port to the same port as the proxy in config.yml');
				if (pong.software == 'Bungeecord') Embed.setFooter('Query disabled! If you want to see more information, please contact the owner and tell them to set query_enabled to true and query_port to the same port as the proxy in config.yml');
				else Embed.setFooter('Query disabled! If you want to see more information, please contact the owner and tell them to set enable-query to true and query.port to the same port as the server in server.properties');
			}
		}
		message.commandName ? message.editReply({ embeds: [Embed] }) : reply.edit({ embeds: [Embed] });
	},
};