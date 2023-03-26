const analyzeProfile = require('../../functions/timings/analyzeProfile').default;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { left, right } = require('../../lang/int/emoji.json');

module.exports = {
	name: 'profile',
	description: 'Analyze Spark profiles to help optimize your server.',
	cooldown: 10,
	args: true,
	usage: '<Spark Profile Link>',
	options: require('../../options/url.js'),
	async execute(message, args) {
		try {
			let id;

			const AnalysisEmbed = new EmbedBuilder()
				.setDescription('These are not magic values. Many of these settings have real consequences on your server\'s mechanics. See [this guide](https://eternity.community/index.php/paper-optimization/) for detailed information on the functionality of each setting.')
				.setFooter({ text: `Requested by ${message.member.user.tag}`, iconURL: message.member.user.avatarURL() });

			for (const arg of args) {
				if ((arg.startsWith('https://timin') || arg.startsWith('https://www.spigotmc.org/go/timings?url=') || arg.startsWith('https://spigotmc.org/go/timings?url='))) {
					AnalysisEmbed.addFields([{ name: '⚠️ Timings Report', value: 'This is a Timings report. Use /timings instead for this type of report.' }]);
					return [{ embeds: [AnalysisEmbed] }];
				}
				if (arg.startsWith('https://spark.lucko.me/')) id = arg.replace('https://spark.lucko.me/', '');
			}

			if (!id) {
				AnalysisEmbed.addFields([{ name: '❌ Invalid Spark Profile URL', value: 'Please provide a valid Spark Profile link.' }]);
				return message.reply({ embeds: [AnalysisEmbed] });
			}

			const fields = (await analyzeProfile(id)).map(field => { return { ...field, inline: true } });

			const suggestions = [...fields];
			const components = [];
			if (suggestions.length >= 13) {
				fields.splice(12, suggestions.length, { name: `Plus ${suggestions.length - 12} more recommendations`, value: 'Click the buttons below to see more' });
				AnalysisEmbed.setFooter({ text: `Requested by ${message.member.user.tag} • Page 1 of ${Math.ceil(suggestions.length / 12)}`, iconURL: message.member.user.avatarURL() });
				components.push(
					new ActionRowBuilder()
						.addComponents([
							new ButtonBuilder()
								.setCustomId('analysis_prev')
								.setEmoji({ id: left })
								.setStyle(ButtonStyle.Secondary),
							new ButtonBuilder()
								.setCustomId('analysis_next')
								.setEmoji({ id: right })
								.setStyle(ButtonStyle.Secondary),
							new ButtonBuilder()
								.setURL('https://github.com/pemigrade/botflop')
								.setLabel('Botflop')
								.setStyle(ButtonStyle.Link),
						]),
				);
			}

			AnalysisEmbed.setAuthor({ name: 'Spark Profile Analysis', url: `https://spark.lucko.me/?id=${id}` })
				.setFields(fields);

			const profilemsg = await message.reply({ embeds: [AnalysisEmbed], components });

			if (suggestions.length < 13) return;
			const filter = i => i.user.id == message.member.id && i.customId.startsWith('analysis_');
			const collector = profilemsg.createMessageComponentCollector({ filter, time: 300000 });
			collector.on('collect', async i => {
				// Defer button
				await i.deferUpdate();

				// Get the embed
				const AnalysisEmbed = new EmbedBuilder(i.message.embeds[0].toJSON());
				const footer = AnalysisEmbed.toJSON().footer;

				// Force analysis button
				if (i.customId == 'analysis_force') {
					const fields = [...suggestions];
					const components = [];
					if (suggestions.length >= 13) {
						fields.splice(12, suggestions.length, { name: '✅ Your server isn\'t lagging', value: `**Plus ${suggestions.length - 12} more recommendations**\nClick the buttons below to see more` });
						components.push(
							new ActionRowBuilder()
								.addComponents([
									new ButtonBuilder()
										.setCustomId('analysis_prev')
										.setEmoji({ id: left })
										.setStyle(ButtonStyle.Secondary),
									new ButtonBuilder()
										.setCustomId('analysis_next')
										.setEmoji({ id: right })
										.setStyle(ButtonStyle.Secondary),
									new ButtonBuilder()
										.setURL('https://github.com/pemigrade/botflop')
										.setLabel('Botflop')
										.setStyle(ButtonStyle.Link),
								]),
						);
					}
					AnalysisEmbed.setFields(fields);

					// Send the embed
					return i.editReply({ embeds: [AnalysisEmbed], components });
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
				AnalysisEmbed
					.setFields(fields)
					.setFooter({ iconURL: footer.iconURL, text: text.join(' • ') });

				// Send the embed
				i.editReply({ embeds: [AnalysisEmbed] });
			});

			// When the collector stops, remove all buttons from it
			collector.on('end', () => {
				if (message.commandName) message.editReply({ components: [] }).catch(err => logger.warn(err));
				else profilemsg.edit({ components: [] }).catch(err => logger.warn(err));
			});
		}
		catch (err) { error(err, message); }
	},
};
