const { NodeactylClient } = require('nodeactyl');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const pteroUpdate = require('../../../functions/ptero/pteroUpdate.js');
const ptero = require('../../../functions/ptero/ptero.js');
const fs = require('fs');
const YAML = require('yaml');
const { servers, pterodactyl } = YAML.parse(fs.readFileSync('./pterodactyl.yml', 'utf8'));
const { refresh } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'ptero',
	description: 'Controls pterodactyl servers on godzillagroin',
	args: true,
	usage: '<server abbreviation>',
	async execute(message, args, client, lang) {
		try {
			const serverlist = servers.map(s => { return `\n${s.short} (${s.name})`; });
			const server = servers.find(srv => args[0].toLowerCase() == srv.short);
			if (!server) return client.error(`Invalid Server!\nPlease use an option from the list below:\n${serverlist.join('')}`, message, true);
			const Client = new NodeactylClient(server.url ?? pterodactyl.url, server.apikey ?? pterodactyl.apikey);
			const info = await Client.getServerDetails(server.id);
			const usages = await Client.getServerUsages(server.id);
			const PteroEmbed = new EmbedBuilder()
				.setTitle(`${info.name} (${usages.current_state.replace(/\b(\w)/g, s => s.toUpperCase())})`)
				.setURL(`${server.url ?? pterodactyl.url}/server/${server.id}`);
			if (usages.current_state == 'running') PteroEmbed.setColor(0x2ECC71);
			if (usages.current_state == 'stopping') PteroEmbed.setColor(0xFF6400);
			if (usages.current_state == 'offline') PteroEmbed.setColor(0xE74C3C);
			if (usages.current_state == 'starting') PteroEmbed.setColor(0xFF6400);
			if (info.node) PteroEmbed.addFields([{ name: '**Node:**', value: info.node, inline: true }]);
			if (info.docker_image) PteroEmbed.addFields([{ name: '**Docker Image:**', value: info.docker_image, inline: true }]);
			if (usages.resources.cpu_absolute) PteroEmbed.addFields([{ name: '**CPU Usage:**', value: `${usages.resources.cpu_absolute}% / ${info.limits.cpu}%`, inline: true }]);
			if (usages.resources.memory_bytes) PteroEmbed.addFields([{ name: '**RAM Usage:**', value: `${Math.round(usages.resources.memory_bytes / 1048576)} MB / ${info.limits.memory} MB`, inline: true }]);
			if (usages.resources.network_tx_bytes) PteroEmbed.addFields([{ name: '**Network Sent:**', value: `${Math.round(usages.resources.network_tx_bytes / 1048576)} MB`, inline: true }]);
			if (usages.resources.network_rx_bytes) PteroEmbed.addFields([{ name: '**Network Recieved:**', value: `${Math.round(usages.resources.network_rx_bytes / 1048576)} MB`, inline: true }]);
			const row = new ActionRowBuilder()
				.addComponents([
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
						.setLabel(lang.refresh)
						.setEmoji({ id: refresh })
						.setStyle(ButtonStyle.Success),
				]);
			const pteroMsg = await message.reply({ embeds: [PteroEmbed], components: [row] });

			const filter = i => i.user.id == message.member.id && i.customId.startsWith('ptero_');
			const collector = pteroMsg.createMessageComponentCollector({ filter, time: 120000 });

			collector.on('collect', async interaction => {
				// Check if the button is one of the ptero buttons
				interaction.deferUpdate();

				// Get the action from the customId
				const action = interaction.customId.split('_')[1];

				// Update action
				if (action == 'update') return pteroUpdate(interaction, Client);

				// Call the ptero function with the action in the customId
				ptero(interaction, client, action);
			});

			// When the collector stops, remove the buttons from it
			collector.on('end', () => { pteroMsg.edit({ components: [] }).catch(err => client.logger.warn(err)); });
		}
		catch (err) { client.error(err, message); }
	},
};