module.exports = async (client, member) => {
	const srvconfig = await client.getData('settings', 'guildId', member.guild.id);
	if (srvconfig.joinmessage == 'false') return;
	if (!member.guild.systemChannel) {
		const owner = await member.guild.fetchOwner();
		client.logger.warn(`${member.guild.name} (${owner.tag}) has misconfigured join messages!`);
		return owner.send({ content: `Join messages are enabled but a system message channel isn't set! Please either go into your server settings (${member.guild.name}) and set the system message channel or turn off join messages with the command \`${srvconfig.prefix}settings joinmessage false\`` }).catch(e => { client.logger.warn(e); });
	}
	const muterole = member.guild.roles.cache.get(srvconfig.muterole);
	const memberdata = await client.getData('memberdata', 'memberId', `${member.user.id}-${member.guild.id}`);
	if (memberdata.mutedUntil) member.roles.add(muterole);
	member.guild.systemChannel.send({ content: srvconfig.joinmessage.replace(/{USER MENTION}/g, client.users.cache.get(member.id)).replace(/{USER TAG}/g, client.users.cache.get(member.id).tag) });
};