const analyzeTimings = require('../../functions/timings/analyzeTimings.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
	name: 'timings',
	description: 'Analyze Paper timings to help optimize your server.',
	cooldown: 10,
	args: true,
	usage: '<Timings Link>',
	options: require('../../options/url.js'),
	async execute(message, args, client) {
		try {
			const timingsresult = await analyzeTimings(message, client, args);
			const timingsmsg = await message.reply(timingsresult[0]);

			// Get the suggestions from the timings result
			const suggestions = timingsresult[1];
			if (suggestions) {
				const filter = i => i.user.id == message.member.id && i.customId.startsWith('analysis_');
				const collector = timingsmsg.createMessageComponentCollector({ filter, time: 300000 });
				collector.on('collect', async i => {
					// Defer button
					i.deferUpdate();

					// Get the embed
					const TimingsEmbed = new EmbedBuilder(i.message.embeds[0].toJSON());
					const footer = TimingsEmbed.toJSON().footer;

					// Force analysis button
					if (i.customId == 'analysis_force') {
						const fields = [...suggestions];
						const components = [];
						if (suggestions.length >= 13) {
							fields.splice(12, suggestions.length, { name: `**Plus ${suggestions.length - 12} more recommendations**`, value: 'Click the buttons below to see more' });
							components.push(
								new ActionRowBuilder()
									.addComponents([
										new ButtonBuilder()
											.setCustomId('analysis_prev')
											.setEmoji({ name: '⬅️' })
											.setStyle(ButtonStyle.Secondary),
										new ButtonBuilder()
											.setCustomId('analysis_next')
											.setEmoji({ name: '➡️' })
											.setStyle(ButtonStyle.Secondary),
										new ButtonBuilder()
											.setURL('https://github.com/pemigrade/botflop')
											.setLabel('Botflop')
											.setStyle(ButtonStyle.Link),
									]),
							);
						}
						TimingsEmbed.setFields(fields);

						// Send the embed
						return timingsmsg.edit({ embeds: [TimingsEmbed], components });
					}

					// Calculate total amount of pages and get current page from embed footer
					const text = footer.text.split(' • ');
					const lastPage = parseInt(text[text.length - 1].split('Page ')[1].split(' ')[0]);
					const maxPages = parseInt(text[text.length - 1].split('Page ')[1].split(' ')[2]);

					// Get next page (if last page, go to pg 1)
					const page = i.customId == 'analysis_next' ? lastPage == maxPages ? 1 : lastPage + 1 : lastPage - 1 ? lastPage - 1 : maxPages;
					const end = page * 12;
					const start = end - 12;
					const fields = suggestions.slice(start, end);

					// Update the embed
					text[text.length - 1] = `Page ${page} of ${Math.ceil(suggestions.length / 12)}`;
					TimingsEmbed
						.setFields(fields)
						.setFooter({ iconURL: footer.iconURL, text: text.join(' • ') });

					// Send the embed
					timingsmsg.edit({ embeds: [TimingsEmbed] });
				});
				collector.on('end', () => timingsmsg.edit({ components: [] }).catch(err => client.logger.warn(err)));
			}
		}
		catch (err) { client.error(err, message); }
	},
};
