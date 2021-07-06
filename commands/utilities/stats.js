const Discord = require('discord.js');
require('moment-duration-format');
const moment = require('moment');
const nodeactyl = require('nodeactyl');
const servers = require('../../config/pterodactyl.json');
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
		if (!args[0]) args = ['pup'];
		const server = servers[args.join(' ').toLowerCase()];
		if (!server) return message.reply('invalid server');
		const Client = new nodeactyl.NodeactylClient(server.url, server.apikey);
		const Embed = new Discord.MessageEmbed().setColor(15105570);
		const info = await Client.getServerDetails(server.id);
		const usages = await Client.getServerUsages(server.id);
		console.log(info);
		if (usages.current_state == 'running') Embed.setColor(65280);
		if (usages.current_state == 'stopping') Embed.setColor(16737280);
		if (usages.current_state == 'offline') Embed.setColor(16711680);
		if (usages.current_state == 'starting') Embed.setColor(16737280);
		info.name ? Embed.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`) : Embed.setTitle(args.join(' '));
		if (server.client == true) {
			const duration = moment.duration(client.uptime).format('D [days], H [hrs], m [mins], s [secs]');
			if (duration) Embed.addField('**Uptime:**', duration);
			Embed.setThumbnail(client.user.avatarURL());
		}
		if (info.node) Embed.addField('**Node:**', info.node);
		if (info.docker_image) Embed.addField('**Docker Image:**', info.docker_image);
		if (usages.resources.cpu_absolute) Embed.addField('**CPU Usage:**', `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`);
		if (usages.resources.memory_bytes) Embed.addField('**RAM Usage:**', `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`);
		if (usages.resources.network_tx_bytes) Embed.addField('**Network Sent:**', `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`);
		if (usages.resources.network_rx_bytes) Embed.addField('**Network Recieved:**', `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`);
		message.reply({ embeds: [Embed] });
	},
};