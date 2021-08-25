const Discord = require('discord.js');
require('moment-duration-format');
const moment = require('moment');
const hastebin = require('hastebin');
const nodeactyl = require('nodeactyl');
const fetch = require('node-fetch');
const servers = require('../../config/pterodactyl.json');
const protocols = require('../../config/mcprotocol.json');
module.exports = {
	name: 'stats',
	description: 'Get the status of Pup or a Minecraft Server',
	aliases: ['status', 'mcstatus', 'mcstats'],
	usage: '[Server]',
	options: [{
		type: 3,
		name: 'server',
		description: 'Specify a Minecraft server',
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		const reply = message.type && message.type == 'APPLICATION_COMMAND' ? await message.defer() : await message.reply({ content: '<a:loading:826611946258038805> Pup is thinking...' });
		if (!args[0]) args = ['pup'];
		const srvs = [];
		Object.keys(servers).map(i => { srvs.push(servers[i]); });
		let server = servers[args.join(' ').toLowerCase()];
		if (!server) server = srvs.find(srv => args[0].toLowerCase() == srv.short);
		const Embed = new Discord.MessageEmbed().setColor(15105570);
		if (server && server.id) {
			const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
			const info = await Client.getServerDetails(server.id);
			const usages = await Client.getServerUsages(server.id);
			if (usages.current_state == 'running') Embed.setColor(65280);
			if (usages.current_state == 'stopping') Embed.setColor(16737280);
			if (usages.current_state == 'offline') Embed.setColor(16711680);
			if (usages.current_state == 'starting') Embed.setColor(16737280);
			if (server.client) {
				const duration = moment.duration(client.uptime).format('D [days], H [hrs], m [mins], s [secs]');
				if (duration) Embed.addField('**Uptime:**', duration, true);
			}
			if (info.node) Embed.addField('**Node:**', info.node, true);
			if (info.docker_image) Embed.addField('**Docker Image:**', info.docker_image, true);
			if (usages.resources.cpu_absolute) Embed.addField('**CPU Usage:**', `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, true);
			if (usages.resources.memory_bytes) Embed.addField('**RAM Usage:**', `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, true);
			if (usages.resources.network_tx_bytes) Embed.addField('**Network Sent:**', `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, true);
			if (usages.resources.network_rx_bytes) Embed.addField('**Network Recieved:**', `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, true);
			info.name ? Embed.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`) : Embed.setTitle(args.join(' '));
			if (server.client) Embed.setThumbnail(client.user.avatarURL());
		}
		else {
			server = { ip: args[0] };
		}
		let iconpng = null;
		if (server.ip) {
			const json = await fetch(`https://api.mcsrvstat.us/2/${server.ip}`);
			const pong = await json.json();
			const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name} (${servers[i].short})`; });
			if (!pong.online) return message.type && message.type == 'APPLICATION_COMMAND' ? message.editReply(`**Invalid Server**\nYou can use any valid Minecraft server IP\nor use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``) : reply.edit(`**Invalid Server**\nYou can use any valid Minecraft server IP\nor use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\``);
			if (!Embed.title && pong.hostname) Embed.setTitle(pong.hostname);
			else if (!Embed.title && pong.port == 25565) Embed.setTitle(pong.ip);
			else if (!Embed.title) Embed.setTitle(`${pong.ip}:${pong.port}`);
			const duration = moment.duration(Date.now() - pong.debug.cachetime * 1000).format('m [mins and] s [secs]');
			Embed.setDescription(`Last Pinged: \`${duration} ago\``);
			if (!pong.debug.cachetime) Embed.setDescription('Last Pinged: `just now`');
			if (pong.version) Embed.addField('**Version:**', pong.version, true);
			if (pong.protocol != -1 && pong.protocol) Embed.addField('**Protocol:**', `${pong.protocol} (${protocols[pong.protocol]})`, true);
			if (pong.software) Embed.addField('**Software:**', pong.software, true);
			if (pong.players) Embed.addField('**Players Online:**', `${pong.players.online} / ${pong.players.max}`, true);
			if (pong.players && pong.players.list && pong.players.online > 50) {
				const link = await hastebin.createPaste(pong.players.list.join('\n'), { server: 'https://bin.birdflop.com' });
				Embed.addField('**Players:**', `[Click Here](${link})`, true);
			}
			else if (pong.players && pong.players.list) {
				Embed.addField('**Players:**', pong.players.list.join('\n').replace(/_/g, '\\_'));
			}
			if (pong.motd) Embed.addField('**MOTD:**', pong.motd.clean.join('\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥'));
			if (pong.icon) {
				const base64string = Buffer.from(pong.icon.replace(/^data:image\/png;base64,/, ''), 'base64');
				iconpng = new Discord.MessageAttachment(base64string, 'icon.png');
				Embed.setThumbnail('attachment://icon.png');
			}
			else {
				Embed.setThumbnail('https://cdn.mos.cms.futurecdn.net/6QQEiDSc3p6yXjhohY3tiF.jpg');
			}
			if (pong.plugins && pong.plugins.raw[0]) {
				const link = await hastebin.createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
				Embed.addField('**Plugins:**', `[Click Here](${link})`, true);
			}
			if (!pong.debug.query) Embed.setFooter('Query disabled! If you want more info, contact the owner to enable query.');
		}
		iconpng ? message.type && message.type == 'APPLICATION_COMMAND' ? message.editReply({ embeds: [Embed], files: [iconpng] }) : reply.edit({ content: null, embeds: [Embed], files: [iconpng] }) : message.type && message.type == 'APPLICATION_COMMAND' ? message.editReply({ embeds: [Embed] }) : reply.edit({ content: null, embeds: [Embed] });
	},
};