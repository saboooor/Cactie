const { schedule } = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { warn } = require('../../lang/int/emoji.json');

module.exports = async (client) => {
	schedule('* * * * *', async () => {
		await client.manager.players.forEach(async player => {
			if (player.timeout && player.timeout < Date.now()) {
				if (!player.textChannel) return player.destroy();
				const AlertEmbed = new EmbedBuilder()
					.setColor('Random')
					.setDescription(`<:alert:${warn}> **Left because of 5 minutes of inactivity!**`)
					.addFields([{ name: 'Tired of me leaving?', value: 'Enable the **24/7** mode with the /247 command!' }])
					.setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });
				const guild = client.guilds.cache.get(player.guild);
				const channel = guild.channels.cache.get(player.textChannel);
				const LeaveMsg = await channel.send({ embeds: [AlertEmbed] });
				player.setNowplayingMessage(LeaveMsg);
				logger.info(`Destroyed player in ${guild.name} because of queue end`);
				player.destroy();
			}
		});
	});
};