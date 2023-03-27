const { createPaste } = require('hastebin');
const { EmbedBuilder } = require('discord.js');
const protocols = require('../misc/mcprotocol.json');

module.exports = {
	name: 'stats_refresh',
	async execute(interaction, client) {
		try {
			const StatsEmbed = new EmbedBuilder(interaction.message.embeds[0].toJSON());
			StatsEmbed.setFields([]);
			const ip = StatsEmbed.toJSON().title;
			const json = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
			const pong = await json.json();
			if (!pong.online) {
				StatsEmbed.setColor(0xFF0000)
					.setDescription(`**${ip}** is offline.`);
				return interaction.reply({ embeds: [StatsEmbed], files: [] });
			}
			if (!StatsEmbed.toJSON().title && pong.hostname) StatsEmbed.setTitle(pong.hostname);
			else if (!StatsEmbed.toJSON().title && pong.port == 25565) StatsEmbed.setTitle(pong.ip);
			else if (!StatsEmbed.toJSON().title) StatsEmbed.setTitle(`${pong.ip}:${pong.port}`);
			if (pong.debug.cachetime) StatsEmbed.setDescription(`Last Pinged: <t:${pong.debug.cachetime}:R>`);
			else StatsEmbed.setDescription(`Last Pinged: <t:${Math.round(Date.now() / 1000)}:R>`);
			if (pong.version) StatsEmbed.addFields([{ name: '**Version:**', value: pong.version, inline: true }]);
			if (pong.protocol != -1 && pong.protocol) StatsEmbed.addFields([{ name: '**Protocol:**', value: `${pong.protocol} (${protocols[pong.protocol]})`, inline: true }]);
			if (pong.software) StatsEmbed.addFields([{ name: '**Software:**', value: pong.software, inline: true }]);
			if (pong.players) StatsEmbed.addFields([{ name: '**Players Online:**', value: `${pong.players.online} / ${pong.players.max}`, inline: true }]);
			if (pong.players && pong.players.list && pong.players.online > 50) {
				const link = await createPaste(pong.players.list.join('\n'), { server: 'https://bin.birdflop.com' });
				StatsEmbed.addFields([{ name: '**Players:**', value: `[Click Here](${link})`, inline: true }]);
			}
			else if (pong.players && pong.players.list) {
				StatsEmbed.addFields([{ name: '**Players:**', value: pong.players.list.join('\n').replace(/_/g, '\\_') }]);
			}
			if (pong.motd) StatsEmbed.addFields([{ name: '**MOTD:**', value: pong.motd.clean.join('\n').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&le;/g, '≤').replace(/&ge;/g, '≥') }]);
			if (pong.plugins && pong.plugins.raw.length) {
				const link = await createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
				StatsEmbed.addFields([{ name: '**Plugins:**', value: `[Click Here](${link})`, inline: true }]);
			}
			if (!pong.debug.query) StatsEmbed.setFooter({ text: 'Query disabled! If you want more info, contact the owner to enable query.' });
			StatsEmbed.setTimestamp();
			interaction.reply({ embeds: [StatsEmbed], files: [] });
		}
		catch (err) { error(err, interaction); }
	},
};