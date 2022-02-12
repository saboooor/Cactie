const { Embed, MessageAttachment, ActionRow, ButtonComponent } = require('discord.js');
const { createPaste } = require('hastebin');
const { NodeactylClient } = require('nodeactyl');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const servers = require('../../config/pterodactyl.json');
const protocols = require('../../lang/int/mcprotocol.json');
module.exports = {
	name: 'stats',
	description: 'Get the status of Pup or a Server',
	aliases: ['status', 'mcstatus', 'mcstats'],
	usage: '[Server]',
	options: require('../options/stats.json'),
	async execute(message, args, client) {
		try {
			if (!args[0]) args = ['pup'];
			const srvs = [];
			Object.keys(servers).map(i => { srvs.push(servers[i]); });
			let server = servers[args.join(' ').toLowerCase()];
			if (!server) server = srvs.find(srv => args[0].toLowerCase() == srv.short);
			const StatsEmbed = new Embed().setColor(Math.floor(Math.random() * 16777215));
			if (server && server.id) {
				const Client = new NodeactylClient(server.url, server.apikey);
				const info = await Client.getServerDetails(server.id);
				const usages = await Client.getServerUsages(server.id);
				if (usages.current_state == 'running') StatsEmbed.setColor(0x2ECC71);
				if (usages.current_state == 'stopping') StatsEmbed.setColor(0xFF6400);
				if (usages.current_state == 'offline') StatsEmbed.setColor(0xE74C3C);
				if (usages.current_state == 'starting') StatsEmbed.setColor(0xFF6400);
				if (server.client) {
					const duration = `<t:${Math.round((Date.now() - client.uptime) / 1000)}:R>`;
					if (duration) StatsEmbed.addField('**Last Started:**', duration, true);
				}
				if (info.node) StatsEmbed.addField('**Node:**', info.node, true);
				if (info.docker_image) StatsEmbed.addField('**Docker Image:**', info.docker_image, true);
				if (usages.resources.cpu_absolute) StatsEmbed.addField('**CPU Usage:**', `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, true);
				if (usages.resources.memory_bytes) StatsEmbed.addField('**RAM Usage:**', `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, true);
				if (usages.resources.network_tx_bytes) StatsEmbed.addField('**Network Sent:**', `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, true);
				if (usages.resources.network_rx_bytes) StatsEmbed.addField('**Network Recieved:**', `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, true);
				info.name ? StatsEmbed.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`) : StatsEmbed.setTitle(args.join(' '));
				if (server.client) StatsEmbed.setThumbnail(client.user.avatarURL({ dynamic : true }));
			}
			else {
				server = { ip: args[0] };
			}
			const iconpng = [];
			if (server.ip) {
				const json = await fetch(`https://api.mcsrvstat.us/2/${server.ip}`);
				const pong = await json.json();
				const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name} (${servers[i].short})`; });
				if (!pong.online) return message.reply({ content: `**Invalid Server**\nYou can use any valid Minecraft server IP\nor use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\`` });
				if (!StatsEmbed.title && pong.hostname) StatsEmbed.setTitle(pong.hostname);
				else if (!StatsEmbed.title && pong.port == 25565) StatsEmbed.setTitle(pong.ip);
				else if (!StatsEmbed.title) StatsEmbed.setTitle(`${pong.ip}:${pong.port}`);
				StatsEmbed.setDescription(`Last Pinged: <t:${pong.debug.cachetime}:R>`);
				if (!pong.debug.cachetime) StatsEmbed.setDescription(`Last Pinged: <t:${Math.round(Date.now() / 1000)}:R>`);
				if (pong.version) StatsEmbed.addField('**Version:**', pong.version, true);
				if (pong.protocol != -1 && pong.protocol) StatsEmbed.addField('**Protocol:**', `${pong.protocol} (${protocols[pong.protocol]})`, true);
				if (pong.software) StatsEmbed.addField('**Software:**', pong.software, true);
				if (pong.players) StatsEmbed.addField('**Players Online:**', `${pong.players.online} / ${pong.players.max}`, true);
				if (pong.players && pong.players.list && pong.players.online > 50) {
					const link = await createPaste(pong.players.list.join('\n'), { server: 'https://bin.birdflop.com' });
					StatsEmbed.addField('**Players:**', `[Click Here](${link})`, true);
				}
				else if (pong.players && pong.players.list) {
					StatsEmbed.addField('**Players:**', pong.players.list.join('\n').replace(/_/g, '\\_'));
				}
				if (pong.motd) StatsEmbed.addField('**MOTD:**', pong.motd.clean.join('\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥'));
				if (pong.icon) {
					const base64string = Buffer.from(pong.icon.replace(/^data:image\/png;base64,/, ''), 'base64');
					iconpng.push(new MessageAttachment(base64string, 'icon.png'));
					StatsEmbed.setThumbnail('attachment://icon.png');
				}
				else {
					StatsEmbed.setThumbnail('https://cdn.mos.cms.futurecdn.net/6QQEiDSc3p6yXjhohY3tiF.jpg');
				}
				if (pong.plugins && pong.plugins.raw[0]) {
					const link = await createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
					StatsEmbed.addField('**Plugins:**', `[Click Here](${link})`, true);
				}
				if (!pong.debug.query) StatsEmbed.setFooter({ text: 'Query disabled! If you want more info, contact the owner to enable query.' });
			}
			StatsEmbed.setURL(`https://${args[0].replace(':', 'colon')}.pup`).setTimestamp();
			const row = new ActionRow().addComponents(
				new ButtonComponent()
					.setCustomId('stats_refresh')
					.setLabel('Refresh')
					.setStyle('SUCCESS'),
			);
			message.reply({ embeds: [StatsEmbed], files: iconpng, components: [row] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};