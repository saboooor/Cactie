const servers = require('../../config/pterodactyl.json');
const srvs = Object.keys(servers).map(i => { return servers[i]; });
const { Embed } = require('discord.js');
module.exports = async function pteroUpdate(interaction, Client) {
	const server = srvs.find(srv => interaction.message.embeds[0].url.split('server/')[1] == srv.id);
	const info = await Client.getServerDetails(server.id);
	const usages = await Client.getServerUsages(server.id);
	const PteroEmbed = new Embed()
		.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`)
		.setURL(`${server.url}/server/${server.id}`);
	if (usages.current_state == 'running') PteroEmbed.setColor(0x2ECC71);
	if (usages.current_state == 'stopping') PteroEmbed.setColor(0xFF6400);
	if (usages.current_state == 'offline') PteroEmbed.setColor(0xE74C3C);
	if (usages.current_state == 'starting') PteroEmbed.setColor(0xFF6400);
	if (info.node) PteroEmbed.addField('**Node:**', info.node, true);
	if (info.docker_image) PteroEmbed.addField('**Docker Image:**', info.docker_image, true);
	if (usages.resources.cpu_absolute) PteroEmbed.addField('**CPU Usage:**', `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, true);
	if (usages.resources.memory_bytes) PteroEmbed.addField('**RAM Usage:**', `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, true);
	if (usages.resources.network_tx_bytes) PteroEmbed.addField('**Network Sent:**', `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, true);
	if (usages.resources.network_rx_bytes) PteroEmbed.addField('**Network Recieved:**', `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, true);
	interaction.reply({ embeds: [PteroEmbed], components: interaction.message.components });
};