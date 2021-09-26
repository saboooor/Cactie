function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { NodeactylClient } = require('nodeactyl');
const { MessageEmbed } = require('discord.js');
const servers = require('../config/pterodactyl.json');
module.exports = {
	name: 'ptero_kill',
	async execute(interaction, client) {
		const srvs = Object.keys(servers).map(i => { return servers[i]; });
		const server = srvs.find(srv => interaction.message.embeds[0].url.split('server/')[1] == srv.id);
		if (!client.guilds.cache.get(server.guildid).members.cache.get(interaction.member.id) || !client.guilds.cache.get(server.guildid).members.cache.get(interaction.member.id).roles.cache.has(server.roleid)) return interaction.member.user.send({ content: 'You can\'t do that!' });
		const Client = new NodeactylClient(server.url, server.apikey);
		Client.killServer(server.id);
		await sleep(1000);
		const info = await Client.getServerDetails(server.id);
		const usages = await Client.getServerUsages(server.id);
		client.logger.info(`Killing ${info.name}`);
		const Embed = new MessageEmbed()
			.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`)
			.setURL(`${server.url}/server/${server.id}`);
		if (usages.current_state == 'running') Embed.setColor(65280);
		if (usages.current_state == 'stopping') Embed.setColor(16737280);
		if (usages.current_state == 'offline') Embed.setColor(16711680);
		if (usages.current_state == 'starting') Embed.setColor(16737280);
		if (info.node) Embed.addField('**Node:**', info.node, true);
		if (info.docker_image) Embed.addField('**Docker Image:**', info.docker_image, true);
		if (usages.resources.cpu_absolute) Embed.addField('**CPU Usage:**', `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, true);
		if (usages.resources.memory_bytes) Embed.addField('**RAM Usage:**', `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, true);
		if (usages.resources.network_tx_bytes) Embed.addField('**Network Sent:**', `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, true);
		if (usages.resources.network_rx_bytes) Embed.addField('**Network Recieved:**', `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, true);
		interaction.update({ embeds: [Embed], components: interaction.message.components });
	},
};