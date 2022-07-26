const { EmbedBuilder } = require('discord.js');
module.exports = async (client, player, track, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	let lang = require('../../lang/English/msg.json');
	if (guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	const FailEmbed = new EmbedBuilder()
		.setColor(0xE74C3C)
		.setDescription(`❌ **${lang.music.track.failed}**`)
		.setFooter({ text: payload.error });
	const errorMsg = await channel.send({ embeds: [FailEmbed] });
	client.logger.error(payload.error);
	client.logger.error(`Failed to load track in ${guild.name}`);
	await sleep(30000);
	errorMsg.delete().catch(err => client.logger.error(err.stack));
};