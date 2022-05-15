const { EmbedBuilder, Attachment, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createPaste } = require('hastebin');
const { NodeactylClient } = require('nodeactyl');
const fs = require('fs');
const YAML = require('yaml');
const { servers, pterodactyl } = YAML.parse(fs.readFileSync('./pterodactyl.yml', 'utf8'));
const protocols = require('../../../lang/int/mcprotocol.json');
const { refresh } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'stats',
	description: 'Get the status of Cactie or a Server',
	aliases: ['status', 'mcstatus', 'mcstats'],
	usage: '[Server]',
	options: require('../../options/stats.js'),
	async execute(message, args, client, lang) {
		try {
			let server = servers.find(s => s.name.toLowerCase() == args.join(' ').toLowerCase());
			if (!server && args[0]) server = servers.find(srv => args[0].toLowerCase() == srv.short);
			if (!server && !args[0]) server = servers.find(srv => srv.client);
			const StatsEmbed = new EmbedBuilder().setColor(Math.floor(Math.random() * 16777215));
			if (server && server.id) {
				const Client = new NodeactylClient(server.url ?? pterodactyl.url, server.apikey ?? pterodactyl.apikey);
				const info = await Client.getServerDetails(server.id);
				const usages = await Client.getServerUsages(server.id);
				if (usages.current_state == 'running') StatsEmbed.setColor(0x2ECC71);
				if (usages.current_state == 'stopping') StatsEmbed.setColor(0xFF6400);
				if (usages.current_state == 'offline') StatsEmbed.setColor(0xE74C3C);
				if (usages.current_state == 'starting') StatsEmbed.setColor(0xFF6400);
				if (server.client) {
					const duration = client.type.name == 'discord' ? `<t:${Math.round((Date.now() - client.uptime) / 1000)}:R>` : `${Date.now() - client.uptime}`;
					if (duration) StatsEmbed.addFields([{ name: '**Last Started:**', value: duration, inline: true }]);
				}
				if (info.node) StatsEmbed.addFields([{ name: '**Node:**', value: info.node, inline: true }]);
				if (info.docker_image) StatsEmbed.addFields([{ name: '**Docker Image:**', value: info.docker_image, inline: true }]);
				if (usages.resources.cpu_absolute) StatsEmbed.addFields([{ name: '**CPU Usage:**', value: `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, inline: true }]);
				if (usages.resources.memory_bytes) StatsEmbed.addFields([{ name: '**RAM Usage:**', value: `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, inline: true }]);
				if (usages.resources.network_tx_bytes) StatsEmbed.addFields([{ name: '**Network Sent:**', value: `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, inline: true }]);
				if (usages.resources.network_rx_bytes) StatsEmbed.addFields([{ name: '**Network Recieved:**', value: `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, inline: true }]);
				info.name ? StatsEmbed.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`) : StatsEmbed.setTitle(args.join(' '));
				if (server.client) StatsEmbed.setThumbnail(client.user.avatarURL());
			}
			else { server = { minecraft: { ip: args[0] } }; }
			const iconpng = [];
			if (server.minecraft && server.minecraft.ip) {
				const json = await fetch(`https://api.mcsrvstat.us/2/${server.minecraft.ip}`);
				const pong = await json.json();
				const serverlist = servers.map(s => { return `\n${s.name} (${s.short})`; });
				if (!pong.online) return message.reply({ content: `**Invalid Server**\nYou can use any valid Minecraft server IP\nor use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\`` });
				if (!StatsEmbed.toJSON().title && pong.hostname) StatsEmbed.setTitle(pong.hostname);
				else if (!StatsEmbed.toJSON().title && pong.port == 25565) StatsEmbed.setTitle(pong.ip);
				else if (!StatsEmbed.toJSON().title) StatsEmbed.setTitle(`${pong.ip}:${pong.port}`);
				StatsEmbed.setDescription(`Last Pinged: ${client.type.name == 'discord' ? `<t:${pong.debug.cachetime}:R>` : `\`${new Date(parseInt(pong.debug.cachetime + '000'))}\``}`);
				if (!pong.debug.cachetime) StatsEmbed.setDescription(`Last Pinged: ${client.type.name == 'discord' ? `<t:${Math.round(Date.now() / 1000)}:R>` : `\`${Date.now()}\``}`);
				if (pong.version) StatsEmbed.addFields([{ name: '**Version:**', value: pong.version, inline: true }]);
				if (pong.protocol != -1 && pong.protocol) StatsEmbed.addFields([{ name: '**Protocol:**', value: `${pong.protocol} (${protocols[pong.protocol]})`, inline: true }]);
				if (pong.software) StatsEmbed.addFields([{ name: '**Software:**', value: pong.software, inline: true }]);
				if (pong.players) StatsEmbed.addFields([{ name: '**Players Online:**', value: `${pong.players.online} / ${pong.players.max}`, inline: true }]);
				if (pong.players && pong.players.list && pong.players.online > 50) {
					const link = await createPaste(pong.players.list.join('\n'), { server: 'https://bin.birdflop.com' });
					StatsEmbed.addFields([{ name: '**Players:**', value: `[Click Here](${link})`, inline: true }]);
				}
				else if (pong.players && pong.players.list) {
					StatsEmbed.addFields([{ name: '**Players:**', value: pong.players.list.join('\n').replace(/_/g, '\\_') }]);
				}
				if (pong.motd) StatsEmbed.addFields([{ name: '**MOTD:**', value: pong.motd.clean.join('\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥') }]);
				if (pong.icon) {
					const base64string = Buffer.from(pong.icon.replace(/^data:image\/png;base64,/, ''), 'base64');
					iconpng.push(new Attachment(base64string, 'icon.png'));
					StatsEmbed.setThumbnail('attachment://icon.png');
				}
				else {
					StatsEmbed.setThumbnail('https://cdn.mos.cms.futurecdn.net/6QQEiDSc3p6yXjhohY3tiF.jpg');
				}
				if (pong.plugins && pong.plugins.raw[0]) {
					const link = await createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
					StatsEmbed.addFields([{ name: '**Plugins:**', value: `[Click Here](${link})`, inline: true }]);
				}
				if (!pong.debug.query) StatsEmbed.setFooter({ text: 'Query disabled! If you want more info, contact the owner to enable query.' });
			}
			StatsEmbed.setURL(`https://${server.short ? server.short : server.minecraft.ip.replace(/:/g, 'colon')}.pup`);
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('stats_refresh')
					.setLabel(lang.refresh)
					.setEmoji({ id: refresh })
					.setStyle(ButtonStyle.Secondary),
			]);
			message.reply({ embeds: [StatsEmbed], files: iconpng, components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};