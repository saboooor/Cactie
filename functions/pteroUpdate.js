const servers = require('../config/pterodactyl.json');
const srvs = Object.keys(servers).map(i => { return servers[i]; });
const { MessageEmbed } = require('discord.js');
module.exports = async function pteroUpdate(interaction, Client) {
	const server = srvs.find(srv => interaction.message.embeds[0].url.split('server/')[1] == srv.id);
	const info = await Client.getServerDetails(server.id);
	const usages = await Client.getServerUsages(server.id);
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
};