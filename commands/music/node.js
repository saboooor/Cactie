const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'nodestats',
	description: 'Check music backend stats',
	aliases: ['ns'],
	async execute(message, args, client) {
		const all = client.manager.nodes.map(node =>
			`Players: ${node.stats.players}` +
            `\nPlaying Players: ${node.stats.playingPlayers}` +
            `\nUptime: ${new Date(node.stats.uptime).toISOString().slice(11, 19)}` +
            '\n\nMemory' +
            `\nReservable Memory: ${Math.round(node.stats.memory.reservable / 1024 / 1024)}mb` +
            `\nUsed Memory: ${Math.round(node.stats.memory.used / 1024 / 1024)}mb` +
            `\nFree Memory: ${Math.round(node.stats.memory.free / 1024 / 1024)}mb` +
            `\nAllocated Memory: ${Math.round(node.stats.memory.allocated / 1024 / 1024)}mb` +
            '\n\nCPU' +
            `\nCores: ${node.stats.cpu.cores}` +
            `\nSystem Load: ${(Math.round(node.stats.cpu.systemLoad * 100) / 100).toFixed(2)}%` +
            `\nLavalink Load: ${(Math.round(node.stats.cpu.lavalinkLoad * 100) / 100).toFixed(2)}%`,
		).join('\n\n----------------------------\n');
		const embed = new MessageEmbed()
			.setDescription(`\`\`\`${all}\`\`\``)
			.setColor(Math.round(Math.random() * 16777215));
		await message.reply({ embeds: [embed] });
	},
};