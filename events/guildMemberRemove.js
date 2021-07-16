module.exports = async (client, member) => {
	const srvconfig = client.settings.get(member.guild.id);
	if (srvconfig.leavemessage == 'false') return;
	if (!member.guild.systemChannel) {
		const owner = await member.guild.fetchOwner();
		client.logger.warn(`${member.guild.name} (${owner.tag}) has misconfigured leave messages!`);
		return owner.send({ content: `Leave messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system message channel or turn off leave messages with the command \`${srvconfig.prefix}settings leavemessage false\`` });
	}
	member.guild.systemChannel.send({ content: srvconfig.leavemessage.replace(/{USER MENTION}/g, client.users.cache.get(member.id)).replace(/{USER TAG}/g, client.users.cache.get(member.id).tag) });
};