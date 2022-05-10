const { EmbedBuilder } = require('discord.js');
const { convertTime } = require('../../functions/music/convert.js');
const { forward } = require('../../lang/int/emoji.json');
module.exports = async (client, payload) => {
	if (payload.op == 'event' && payload.type == 'SegmentSkipped') {
		const player = client.manager.get(payload.guildId);
		const guild = client.guilds.cache.get(player.guild);
		const channel = guild.channels.cache.get(player.textChannel);
		const BlockEmbed = new EmbedBuilder()
			.setColor(Math.floor(Math.random() * 16777215))
			.setDescription(`<:forward:${forward}> **Skipped ${payload.segment.category}**\nfrom \`${convertTime(payload.segment.start)}\` to \`${convertTime(payload.segment.end)}\``);
		await channel.send({ embeds: [BlockEmbed] });
		client.logger.info(`Skipped ${payload.segment.category} from ${convertTime(payload.segment.start)} to ${convertTime(payload.segment.end)} in ${guild.name}`);
	}
};