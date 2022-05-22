function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { EmbedBuilder } = require('discord.js');
module.exports = async (client, player, track) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const data = await client.query(`SELECT * FROM memberdata WHERE memberId = '${track.requester.id}'`);
	let lang = require('../../lang/English/msg.json');
	if (guild.preferredLocale.split('-')[0] == 'en') lang = require('../../lang/English/msg.json');
	else if (guild.preferredLocale.split('-')[0] == 'pt') lang = require('../../lang/Portuguese/msg.json');
	if (srvconfig.language != 'false') lang = require(`../../lang/${srvconfig.language}/msg.json`);
	if (data[0]) lang = require(`../../lang/${data[0].language}/msg.json`);
	const StuckEmbed = new EmbedBuilder()
		.setColor(0xE74C3C)
		.setDescription(`❌ [${track.title}](${track.uri}) ${lang.music.track.stuck}`);
	const errorMsg = await channel.send({ embeds: [StuckEmbed] });
	client.logger.error(`${track.title} got stuck in ${guild.name}`);
	if (!player.queue.current) player.destroy();
	await sleep(30000);
	errorMsg.delete();
};