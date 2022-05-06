const { Embed } = require('guilded.js');
module.exports = async (client, member) => {
	client.logger.info(`${client.user.name} has been added to ${member.serverId}`);
	if (member.user.id != client.user.id) return;
	const AddEmbed = new Embed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.name} has been added to ${member.serverId}`);
	client.messages.send('e1eb6361-e31d-43b9-afce-2c05ba4fb95e', { embeds: [AddEmbed] });
};