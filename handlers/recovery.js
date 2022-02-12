const { Embed } = require('discord.js');
const fs = require('fs');
module.exports = client => {
	process.on('unhandledRejection', async (reason) => {
		const CrashEmbed = new Embed()
			.setColor(0xE74C3C)
			.setTitle('Crash Detected')
			.setURL(`https://panel.netherdepths.com/server/41769d86/files/edit#/logs/${client.date}.log`)
			.addField('Error', `\`\`\`${reason}\`\`\``.replace(/: /g, '\n'));
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [Embed] });
		CrashEmbed.setDescription('This error has been logged and will be fixed soon.\nPup will be back up in a few seconds and keep your music playing!\nSorry for the inconvenience.');
		await client.manager.players.forEach(async player => {
			await client.guilds.cache.get(player.guild).channels.cache.get(player.textChannel).send({ embeds: [Embed] });
			player.queue.unshift(player.queue.current);
			const playerjson = {
				voiceChannel: player.options.voiceChannel,
				textChannel: player.textChannel,
				guild: player.guild,
				queue: player.queue,
				trackRepeat: player.trackRepeat,
				queueRepeat: player.queueRepeat,
				position: player.position,
				volume: player.volume,
				paused: player.paused,
			};
			const prevlines = fs.readFileSync('playercache.txt');
			fs.writeFileSync('playercache.txt', `${prevlines}\n${JSON.stringify(playerjson)}`);
			player.destroy();
		});
	});
};