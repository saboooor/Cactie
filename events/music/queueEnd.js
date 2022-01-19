function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { MessageEmbed } = require('discord.js');
const { warn } = require('../../config/emoji.json');
module.exports = async (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);
	const thing = new MessageEmbed()
		.setColor(Math.round(Math.random() * 16777215))
		.setDescription(`${warn} **Music session ended**`)
		.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic : true }) });
	const NowPlaying = await channel.send({ embeds: [thing] });
	player.setNowplayingMessage(NowPlaying);
	if (!player.twentyFourSeven) {
		await sleep(300000);
		if (player.queue.current) return;
		const Embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setDescription(`${warn} **Left because of 5 minutes of inactivity!**`)
			.addField('Tired of me leaving?', 'Enable the **24/7** mode with the /247 command!')
			.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic : true }) });
		const LeaveMsg = await channel.send({ embeds: [Embed] });
		player.setNowplayingMessage(LeaveMsg);
		client.logger.info(`Destroyed player in ${client.guilds.cache.get(player.guild).name} because of queue end`);
		player.destroy();
	}
};