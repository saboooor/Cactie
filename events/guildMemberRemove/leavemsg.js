module.exports = async (client, member) => {
	// Get the guild settings
	const srvconfig = await client.getData('settings', { guildId: member.guild.id });

	// Parse the JSON
	srvconfig.leavemessage = JSON.parse(srvconfig.leavemessage);

	// Check if leave message is set
	if (!srvconfig.leavemessage.message) return;

	// Check if system channel is set
	if (srvconfig.leavemessage.channel == 'false' && !member.guild.systemChannel) {
		const owner = await member.guild.fetchOwner();
		logger.warn(`${member.guild.name} (${owner.tag}) doesn't have a system channel set!`);
		return owner.send({ content: `Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system messages channel or turn off leave messages at ${client.dashboardDomain}` })
			.catch(err => logger.warn(err));
	}

	// Send the leave message to the system channel
	const channel = srvconfig.leavemessage.channel == 'false' ? member.guild.systemChannel : member.guild.channels.cache.get(srvconfig.leavemessage.channel);
	channel.send({ content: srvconfig.leavemessage.message.replace(/{USER MENTION}/g, `${member}`).replace(/{USER TAG}/g, member.user.tag) }).catch(err => logger.error(err));
	logger.info(`Sent leave message to ${member.guild.name} for ${member.user.tag}`);
};