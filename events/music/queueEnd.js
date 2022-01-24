function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
module.exports = async (client, player) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor(Math.round(Math.random() * 16777215))
		.setDescription('⚠️ **Music session ended**')
		.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic : true }) });
	const NowPlaying = await channel.send({ embeds: [thing] });
	player.setNowplayingMessage(NowPlaying);
	if (!player.twentyFourSeven) {
		await sleep(300000);
		if (player.queue.current) return;
		if (!player.voiceChannel) return;
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription('⚠️ **Left because of 5 minutes of inactivity!**')
			.addField('Tired of me leaving?', 'Enable the **24/7** mode with the /247 command!')
			.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic : true }) });
		const LeaveMsg = await channel.send({ embeds: [Embed] });
		player.setNowplayingMessage(LeaveMsg);
		client.logger.info(`Destroyed player in ${guild.name} because of queue end`);
		player.destroy();
	}
};