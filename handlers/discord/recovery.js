const { EmbedBuilder, ActivityType } = require('discord.js');
const fs = require('fs');
module.exports = client => {
	process.on('unhandledRejection', async (reason) => {
		const CrashEmbed = new EmbedBuilder()
			.setColor(0xE74C3C)
			.setTitle('Crash Detected')
			.setURL(`https://panel.netherdepths.com/server/${client.user.username == 'Cactie' ? '41769d86' : '3f2661e1'}/files/edit#/logs/${client.date}.log`)
			.addFields([{ name: 'Error', value: `\`\`\`${reason.stack}\`\`\``.replace(/: /g, '\n') }]);
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [CrashEmbed] });
		CrashEmbed.setDescription(`This error has been logged and will be fixed soon.\n${client.user.username} will be back up in a few seconds and keep your music playing!\nSorry for the inconvenience.`);
		await client.manager.players.forEach(async player => {
			await client.guilds.cache.get(player.guild).channels.cache.get(player.textChannel).send({ embeds: [CrashEmbed] });
			player.queue.unshift(player.queue.current);
			const { textChannel, queue, trackRepeat, queueRepeat, position, paused, volume } = player;
			const playerjson = {
				voiceChannel: player.options.voiceChannel,
				guild: player.guild,
				textChannel, queue, trackRepeat, queueRepeat, position, paused, volume,
			};
			const prevlines = fs.existsSync('playercache.txt') ? fs.readFileSync('playercache.txt') : '';
			fs.writeFileSync('playercache.txt', `${prevlines}\n${JSON.stringify(playerjson)}`);
			player.destroy();
		});
		client.user.setPresence({ activities: [{ name: 'Bot crashed! Sorry for the inconvenience', type: ActivityType.Game }] });
	});
};