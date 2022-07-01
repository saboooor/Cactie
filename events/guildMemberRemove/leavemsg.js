module.exports = async (client, member) => {
	// Get the guild settings
	const srvconfig = await client.getData('settings', 'guildId', member.guild.id);

	// Check if join message is set
	if (srvconfig.leavemessage == 'false') return;

	// Check if system channel is set
	if (!member.guild.systemChannel) {
		const owner = await member.guild.fetchOwner();
		client.logger.warn(`${member.guild.name} (${owner.tag}) doesn't have a system channel set!`);
		return owner.send({ content: `Leave messages are enabled but a system message channel isn't set!\nPlease either go into your server settings (${member.guild.name}) and set the system messages channel or turn off leave messages with the \`/settings\` command` })
			.catch(err => client.logger.warn(err));
	}

	// Send the join message to the system channel
	member.guild.systemChannel.send({ content: srvconfig.leavemessage.replace(/{USER MENTION}/g, `${member}`).replace(/{USER TAG}/g, member.user.tag) });
	client.logger.log(`Sent leave message to ${member.guild.name} for ${member.user.tag}`);
};