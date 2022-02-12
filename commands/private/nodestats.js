const { Embed } = require('discord.js');
module.exports = {
	name: 'nodestats',
	description: 'Check music backend stats',
	async execute(message, args, client) {
		try {
			const all = client.manager.nodes.map(node =>
				`**Players:** ${node.stats.players}` +
            `\n**Playing Players:** ${node.stats.playingPlayers}` +
            `\n**Uptime:** ${new Date(node.stats.uptime).toISOString().slice(11, 19)}` +
            `\n**Reservable Memory:** ${Math.round(node.stats.memory.reservable / 1024 / 1024)}mb` +
            `\n**Used Memory:** ${Math.round(node.stats.memory.used / 1024 / 1024)}mb` +
            `\n**Free Memory:** ${Math.round(node.stats.memory.free / 1024 / 1024)}mb` +
            `\n**Allocated Memory:** ${Math.round(node.stats.memory.allocated / 1024 / 1024)}mb` +
            `\n**Cores:** ${node.stats.cpu.cores}` +
            `\n**System Load:** ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` +
            `\n**Lavalink Load:** ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`,
			).join('\n\n----------------------------\n');
			const StatsEmbed = new Embed()
				.setDescription(all)
				.setColor(Math.round(Math.random() * 16777215));
			await message.reply({ embeds: [StatsEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};