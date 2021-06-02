module.exports = (client, guild) => {
	client.settings.delete(guild.id);
};