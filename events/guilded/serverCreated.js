const { EmbedBuilder } = require('discord.js');
module.exports = async (client, member) => {
	const guild = await client.servers.fetch(member.serverId);
	let owner = await client.members.cache.get(`${guild.id}:${guild.ownerId}`);
	if (!owner) owner = await client.members.fetch(guild.id, guild.ownerId);
	const srvEmbed = new EmbedBuilder()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.name} has been added to ${guild.name}`)
		.setThumbnail(guild.iconURL)
		.setFooter({ text: `Owner: ${owner.user.name}`, iconURL: owner.user.avatar });
	if (guild.raw.banner) srvEmbed.setImage(guild.raw.banner);
	if (guild.timezone) srvEmbed.addFields([{ name: 'Timezone', value: `${guild.timezone}` }]);
	const timestamp = new Date(guild.createdAt);
	const string = timestamp.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
	const members = await client.members.fetchMany(guild.id);
	srvEmbed.addFields([
		{ name: 'Members', value: `${members.size}` },
		{ name: 'Created At', value: `${string}` },
	]);
	if (guild.shortURL) srvEmbed.addFields([{ name: 'Vanity URL', value: `guilded.gg/${guild.shortURL}` }]);
	client.messages.send('e1eb6361-e31d-43b9-afce-2c05ba4fb95e', { embeds: [srvEmbed] });
	client.logger.info(`${client.user.name} has been added to ${member.serverId}`);
};