const { createPaste } = require('hastebin');
const { NodeactylClient } = require('nodeactyl');
const fetch = (...args) => import('node-fetch').then(({ default: e }) => e(...args));
const servers = require('../config/pterodactyl.json');
const protocols = require('../lang/int/mcprotocol.json');
module.exports = {
	name: 'stats_refresh',
	async execute(interaction, client) {
		try {
			const srvs = [];
			Object.keys(servers).map(i => { srvs.push(servers[i]); });
			const StatsEmbed = interaction.message.embeds[0];
			StatsEmbed.fields = [];
			const arg = StatsEmbed.url.replace('https://', '').split('.pup')[0].replace('colon', ':');
			let server = servers[arg.toLowerCase()];
			if (!server) server = srvs.find(srv => arg.toLowerCase() == srv.short);
			if (server && server.id) {
				const Client = new NodeactylClient(server.url, server.apikey);
				const info = await Client.getServerDetails(server.id);
				const usages = await Client.getServerUsages(server.id);
				if (usages.current_state == 'running') StatsEmbed.setColor(65280);
				if (usages.current_state == 'stopping') StatsEmbed.setColor(16737280);
				if (usages.current_state == 'offline') StatsEmbed.setColor(16711680);
				if (usages.current_state == 'starting') StatsEmbed.setColor(16737280);
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
				info.name ? StatsEmbed.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`) : StatsEmbed.setTitle(arg);
				if (server.client) StatsEmbed.setThumbnail(client.user.avatarURL({ dynamic : true }));
			}
			else {
				server = { ip: arg };
			}
			if (server.ip) {
				const json = await fetch(`https://api.mcsrvstat.us/2/${server.ip}`);
				const pong = await json.json();
				const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name} (${servers[i].short})`; });
				if (!pong.online) return interaction.reply({ content: `**Invalid Server**\nYou can use any valid Minecraft server IP\nor use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\`` });
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
				if (pong.plugins && pong.plugins.raw[0]) {
					const link = await createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
					StatsEmbed.addField('**Plugins:**', `[Click Here](${link})`, true);
				}
				if (!pong.debug.query) StatsEmbed.setFooter({ text: 'Query disabled! If you want more info, contact the owner to enable query.' });
			}
			StatsEmbed.setTimestamp();
			interaction.reply({ embeds: [StatsEmbed], components: interaction.message.components, files: [] });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};