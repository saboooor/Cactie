const { NodeactylClient } = require('nodeactyl');
const { Embed, MessageButton, MessageActionRow } = require('discord.js');
const servers = require('../../config/pterodactyl.json');
module.exports = {
	name: 'ptero',
	description: 'Controls pterodactyl servers on godzillagroin',
	async execute(message, args, client) {
		try {
			const serverlist = Object.keys(servers).map(i => { return `\n${servers[i].name} (${servers[i].short})`; });
			if (!args[0]) {
				args = [];
				serverlist.forEach(i => {
					i = i.replace('\n', '').split(' (')[0].toLowerCase();
					if (servers[i].guildid == message.guild.id) args.push(servers[i].name);
				});
				if (args[1]) args = ['dumb'];
				if (!args[0]) args = ['pup'];
			}
			const srvs = Object.keys(servers).map(i => { return servers[i]; });
			let server = servers[args.join(' ').toLowerCase()];
			if (!server) server = srvs.find(srv => args[0].toLowerCase() == srv.short);
			if (!server) return message.reply({ content: `**Invalid Server**\nPlease use an option from the list below:\`\`\`yml${serverlist.join('')}\`\`\`` });
			const Client = new NodeactylClient(server.url, server.apikey);
			const info = await Client.getServerDetails(server.id);
			const usages = await Client.getServerUsages(server.id);
			const PteroEmbed = new Embed()
				.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`)
				.setURL(`${server.url}/server/${server.id}`);
			if (usages.current_state == 'running') PteroEmbed.setColor(65280);
			if (usages.current_state == 'stopping') PteroEmbed.setColor(16737280);
			if (usages.current_state == 'offline') PteroEmbed.setColor(16711680);
			if (usages.current_state == 'starting') PteroEmbed.setColor(16737280);
			if (info.node) PteroEmbed.addField('**Node:**', info.node, true);
			if (info.docker_image) PteroEmbed.addField('**Docker Image:**', info.docker_image, true);
			if (usages.resources.cpu_absolute) PteroEmbed.addField('**CPU Usage:**', `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, true);
			if (usages.resources.memory_bytes) PteroEmbed.addField('**RAM Usage:**', `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, true);
			if (usages.resources.network_tx_bytes) PteroEmbed.addField('**Network Sent:**', `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, true);
			if (usages.resources.network_rx_bytes) PteroEmbed.addField('**Network Recieved:**', `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, true);
			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('ptero_start')
						.setLabel('Start')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('ptero_restart')
						.setLabel('Restart')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('ptero_stop')
						.setLabel('Stop')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('ptero_kill')
						.setLabel('Kill')
						.setStyle('DANGER'),
					new MessageButton()
						.setCustomId('ptero_update')
						.setLabel('Update')
						.setStyle('SUCCESS'),
				);
			message.reply({ embeds: [PteroEmbed], components: [row] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};