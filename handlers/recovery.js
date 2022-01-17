const { MessageEmbed } = require('discord.js');
const fs = require('fs');
module.exports = client => {
	process.on('unhandledRejection', async (reason) => {
		const Embed = new MessageEmbed()
			.setColor('#ff0000')
			.setTitle('Error Detected')
			.setURL('https://panel.netherdepths.com/server/41769d86')
			.addField('Error', `\`\`\`${reason}\`\`\``.replace(/: /g, '\n'));
		client.guilds.cache.get('811354612547190794').channels.cache.get('830013224753561630').send({ content: '<@&839158574138523689>', embeds: [Embed] });
		Embed.setDescription('This error has been logged and will be fixed soon.\nPup will be back up in a few seconds and keep your music playing!\nSorry for the inconvenience.');
		await client.manager.players.forEach(async player => {
			// await client.channels.cache.get(player.textChannel).send({ embeds: [Embed] });
			const playerjson = {
				voiceChannel: player.options.voiceChannel,
				textChannel: player.textChannel,
				guild: player.guild,
				track: player.queue.current,
				queue: player.queue,
				trackRepeat: player.trackRepeat,
				queueRepeat: player.queueRepeat,
				position: player.position,
			};
			const prevlines = fs.readFileSync('playercache.txt');
			fs.writeFileSync('playercache.txt', `${prevlines}\n${JSON.stringify(playerjson)}`);
		});
	});
};