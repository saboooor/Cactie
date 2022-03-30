const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { refresh } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'ping',
	description: 'Pong!',
	ephemeral: true,
	aliases: ['pong'],
	cooldown: 10,
	async execute(message, args, client) {
		try {
			// Get the array of pong responses
			const pong = require(`../../lang/${message.lang.language.name}/pong.json`);

			// Create embed with ping information and add ping again button
			const PingEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(pong[0])
				.setDescription(`**${message.lang.ping.latency}** ${Date.now() - message.createdTimestamp}ms\n**${message.lang.ping.api}** ${client.ws.ping}ms`);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('ping_again')
						.setEmoji({ id: refresh })
						.setLabel(message.lang.refresh)
						.setStyle(ButtonStyle.Secondary),
				);

			// reply with embed
			const pingmsg = await message.reply({ embeds: [PingEmbed], components: [row] });

			// create collector for ping again button
			const filter = i => i.customId == 'ping_again';
			const collector = pingmsg.createMessageComponentCollector({ filter, time: args[0] == 'reset' ? 30000 : 120000 });
			collector.on('collect', async interaction => {
				// Check if the button is one of the settings buttons
				interaction.deferUpdate();

				// Set the embed description with new ping stuff
				PingEmbed.setDescription(`**${message.lang.ping.latency}** ${Date.now() - interaction.createdTimestamp}ms\n**${message.lang.ping.api}** ${client.ws.ping}ms`);

				// Get next string (if last index, go to index 0)
				const newIndex = pong.indexOf(PingEmbed.toJSON().title) == pong.length - 1 ? 0 : pong.indexOf(PingEmbed.toJSON().title) + 1;

				// Set title and update message
				PingEmbed.setTitle(pong[newIndex]);
				pingmsg.edit({ embeds: [PingEmbed] });
			});

			// When the collector stops, remove the undo button from it
			collector.on('end', () => pingmsg.edit({ components: [] }));
		}
		catch (err) { client.error(err, message); }
	},
};