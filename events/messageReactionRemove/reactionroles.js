const checkPerms = require('../../functions/checkPerms');

module.exports = async (client, reaction, user) => {
	// Check if author is a bot or guild is undefined
	if (user.bot || !reaction.message.guildId) return;

	// Check if the bot has permission to manage messages
	const permCheck = checkPerms(['ReadMessageHistory'], message.guild.members.me, message.channel);
	if (permCheck) return logger.warn(permCheck);

	// Fetch the reaction's message
	const message = await reaction.message.fetch().catch(err => logger.error(err));

	// Get the reaction's emoji
	const emojiId = reaction.emoji.id ?? reaction.emoji.name;

	// Get the reaction role from the database and check if it exists
	const reactionrole = (await client.query(`SELECT * FROM reactionroles WHERE messageId = '${message.id}' AND emojiId = '${emojiId}'`))[0];
	if (!reactionrole || reactionrole.type == 'toggle') return;

	// Get the reaction role's role
	const role = message.guild.roles.cache.get(reactionrole.roleId);
	if (!role) return client.error('The role can\'t be found!', message, true);

	// Get the reaction role's author as a member
	const member = await message.guild.members.fetch(user.id);

	// Remove the role from the member
	await member.roles.remove(role);

	// Send message and log
	const msg = await message.channel.send({ content: `❌ **Removed ${role.name} Role from ${user}**` });
	logger.info(`Removed ${role.name} Role from ${user.tag} in ${message.guild.name}`);

	// Delete the message after 5 seconds
	await sleep(5000);
	await msg.delete().catch(err => logger.error(err));
};