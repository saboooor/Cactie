const checkPerms = require('../../functions/checkPerms');

module.exports = async (client, reaction, user) => {
	// Check if author is a bot or guild is undefined
	if (user.bot || !reaction.message.guildId) return;

	// Get the guild of the reaction
	const guild = await client.guilds.fetch(reaction.message.guildId);

	// Check if the bot has permission to manage messages
	const permCheck = checkPerms(['ReadMessageHistory'], guild.members.me, reaction.message.channelId);
	if (permCheck) return;

	// Fetch the reaction's message
	const message = await reaction.message.fetch().catch(err => logger.error(err));

	// Get the reaction's emoji
	const emojiId = reaction.emoji.id ?? reaction.emoji.name;

	// Get the reaction role from the database and check if it exists
	const reactionrole = (await client.query(`SELECT * FROM reactionroles WHERE messageId = '${message.id}' AND emojiId = '${emojiId}'`))[0];
	if (!reactionrole) return;

	// Get the reaction role's role
	const role = message.guild.roles.cache.get(reactionrole.roleId);
	if (!role) return client.error('The role can\'t be found!', message, true);

	// Get the reaction role's author as a member
	const member = await message.guild.members.fetch(user.id);

	// Check if the reaction role is a toggle or switch type
	let msg;
	if (reactionrole.type == 'toggle') {
		// Remove the reaction from the message
		reaction.users.remove(user.id);

		// Check if the member has the role
		if (!member.roles.cache.has(role.id)) {
			// Add the role to the member
			await member.roles.add(role);

			// Send message and log
			if (reactionrole.silent != 'false') msg = await message.channel.send({ content: `✅ **Added ${role.name} Role to ${user}**` });
			logger.info(`Added ${role.name} Role to ${user.tag} in ${message.guild.name}`);
		}
		else {
			// Remove the role from the member
			await member.roles.remove(role);

			// Send message and log
			if (reactionrole.silent != 'false') msg = await message.channel.send({ content: `❌ **Removed ${role.name} Role from ${user}**` });
			logger.info(`Removed ${role.name} Role from ${user.tag} in ${message.guild.name}`);
		}
	}
	else {
		// Add the role to the member
		await member.roles.add(role);

		// Send message and log
		if (reactionrole.silent != 'false') msg = await message.channel.send({ content: `✅ **Added ${role.name} Role to ${user}**` });
		logger.info(`Added ${role.name} Role to ${user.tag} in ${message.guild.name}`);
	}

	// Check if message was sent
	if (!msg) return;

	// Delete the message after 5 seconds
	await sleep(5000);
	await msg.delete().catch(err => logger.error(err));
};