const { NodeactylClient } = require('nodeactyl');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const pteroUpdate = require('../../functions/ptero/pteroUpdate.js');
const ptero = require('../../functions/ptero/ptero.js');
const servers = require('../../config/pterodactyl.json');
const { refresh } = require('../../lang/int/emoji.json');
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
			const PteroEmbed = new EmbedBuilder()
				.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`)
				.setURL(`${server.url}/server/${server.id}`);
			if (usages.current_state == 'running') PteroEmbed.setColor(0x2ECC71);
			if (usages.current_state == 'stopping') PteroEmbed.setColor(0xFF6400);
			if (usages.current_state == 'offline') PteroEmbed.setColor(0xE74C3C);
			if (usages.current_state == 'starting') PteroEmbed.setColor(0xFF6400);
			if (info.node) PteroEmbed.addFields({ name: '**Node:**', value: info.node, inline: true });
			if (info.docker_image) PteroEmbed.addFields({ name: '**Docker Image:**', value: info.docker_image, inline: true });
			if (usages.resources.cpu_absolute) PteroEmbed.addFields({ name: '**CPU Usage:**', value: `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, inline: true });
			if (usages.resources.memory_bytes) PteroEmbed.addFields({ name: '**RAM Usage:**', value: `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, inline: true });
			if (usages.resources.network_tx_bytes) PteroEmbed.addFields({ name: '**Network Sent:**', value: `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, inline: true });
			if (usages.resources.network_rx_bytes) PteroEmbed.addFields({ name: '**Network Recieved:**', value: `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, inline: true });
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('ptero_start')
						.setLabel('Start')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId('ptero_restart')
						.setLabel('Restart')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId('ptero_stop')
						.setLabel('Stop')
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId('ptero_kill')
						.setLabel('Kill')
						.setStyle(ButtonStyle.Danger),
					new ButtonBuilder()
						.setCustomId('ptero_update')
						.setLabel(message.lang.refresh)
						.setEmoji({ id: refresh })
						.setStyle(ButtonStyle.Success),
				);
			const pteroMsg = await message.reply({ embeds: [PteroEmbed], components: [row] });

			const collector = pteroMsg.createMessageComponentCollector({ time: 120000 });

			collector.on('collect', async interaction => {
				// Check if the button is one of the ptero buttons
				if (!interaction.customId.startsWith('ptero_')) return;
				interaction.deferUpdate();

				// Get the action from the customId
				const action = interaction.customId.split('_')[1];

				// Update action
				if (action == 'update') return pteroUpdate(interaction, Client);

				// Call the ptero function with the action in the customId
				ptero(interaction, client, action);
			});

			// When the collector stops, remove the buttons from it
			collector.on('end', () => { pteroMsg.edit({ components: [] }); });
		}
		catch (err) { client.error(err, message); }
	},
};