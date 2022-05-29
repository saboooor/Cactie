const { EmbedBuilder, Attachment, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createPaste } = require('hastebin');
const protocols = require('../../../lang/int/mcprotocol.json');
const { refresh } = require('../../../lang/int/emoji.json');
module.exports = {
	name: 'mcstats',
	description: 'Get the status of a Minecraft server',
	aliases: ['mcstatus'],
	usage: '<Server IP>',
	options: require('../../options/stats.js'),
	async execute(message, args, client, lang) {
		try {
			const StatsEmbed = new EmbedBuilder().setColor(Math.floor(Math.random() * 16777215));
			const iconpng = [];
			const json = await fetch(`https://api.mcsrvstat.us/2/${args[0]}`);
			const pong = await json.json();
			if (!pong.online) return message.reply({ content: '**Invalid Server IP**' });
			if (pong.hostname) StatsEmbed.setTitle(pong.hostname);
			else if (pong.port == 25565) StatsEmbed.setTitle(pong.ip);
			else StatsEmbed.setTitle(`${pong.ip}:${pong.port}`);
			if (pong.debug.cachetime) StatsEmbed.setDescription(`Last Pinged: ${client.type.name == 'discord' ? `<t:${pong.debug.cachetime}:R>` : `\`${new Date(parseInt(pong.debug.cachetime + '000'))}\``}`);
			else StatsEmbed.setDescription(`Last Pinged: ${client.type.name == 'discord' ? `<t:${Math.round(Date.now() / 1000)}:R>` : `\`${Date.now()}\``}`);
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
			if (pong.icon) {
				const base64string = Buffer.from(pong.icon.replace(/^data:image\/png;base64,/, ''), 'base64');
				iconpng.push(new Attachment(base64string, 'server-icon.png'));
				StatsEmbed.setThumbnail('attachment://server-icon.png');
			}
			else {
				StatsEmbed.setThumbnail('https://i.redd.it/9thcbxqlasl51.png');
			}
			if (pong.plugins && pong.plugins.raw[0]) {
				const link = await createPaste(pong.plugins.raw.join('\n'), { server: 'https://bin.birdflop.com' });
				StatsEmbed.addFields([{ name: '**Plugins:**', value: `[Click Here](${link})`, inline: true }]);
			}
			if (!pong.debug.query) StatsEmbed.setFooter({ text: 'Query disabled! If you want more info, contact the owner to enable query.' });
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId('stats_refresh')
					.setLabel(lang.refresh)
					.setEmoji({ id: refresh })
					.setStyle(ButtonStyle.Secondary),
			]);
			message.reply({ embeds: [StatsEmbed], files: iconpng, components: [row] });
		}
		catch (err) { client.error(err, message); }
	},
};