const { schedule } = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { warn } = require('../../../lang/int/emoji.json');
module.exports = async (client) => {
	schedule('* * * * *', async () => {
		await client.manager.players.forEach(async player => {
			if (player.timeout && player.timeout < Date.now()) {
				client.logger.info(player.timeout);
				if (!player.voiceChannel) return;
				const AlertEmbed = new EmbedBuilder()
					.setColor(Math.floor(Math.random() * 16777215))
					.setDescription(`<:alert:${warn}> **Left because of 5 minutes of inactivity!**`)
					.addFields([{ name: 'Tired of me leaving?', value: 'Enable the **24/7** mode with the /247 command!' }])
					.setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });
				const guild = client.guilds.cache.get(player.guild);
				const channel = guild.channels.cache.get(player.textChannel);
				const LeaveMsg = await channel.send({ embeds: [AlertEmbed] });
				player.setNowplayingMessage(LeaveMsg);
				client.logger.info(`Destroyed player in ${guild.name} because of queue end`);
				player.destroy();
			}
		});
	});
};