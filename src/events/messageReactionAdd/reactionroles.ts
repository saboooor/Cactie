import { PrismaClient } from '@prisma/client';
import { Client, MessageReaction, User } from 'discord.js';
import checkPerms from '~/functions/checkPerms';

export default async (client: Client, reaction: MessageReaction, user: User) => {
  // Check if author is a bot or guild is undefined
  if (user.bot || !reaction.message.guildId) return;

  // Get the guild of the reaction
  const guild = await client.guilds.fetch(reaction.message.guildId);

  // Check if the bot has permission to manage messages
  const permCheck = checkPerms(['ReadMessageHistory'], guild.members.me!, reaction.message.channelId);
  if (permCheck) return;

  // Fetch the reaction's message
  const message = await reaction.message.fetch().catch(err => {
    logger.error(err);
    return null;
  });
  if (!message) return;

  // Get the reaction's emoji
  const emojiId = reaction.emoji.id ?? reaction.emoji.name;
  if (!emojiId) return;

  // Get the reaction role from the database and check if it exists
  const prisma = new PrismaClient();
  const reactionrole = await prisma.reactionroles.findUnique({ where: { messageId_emojiId: { messageId: message.id, emojiId } } });
  if (!reactionrole) return;

  // Get the reaction role's role
  const role = reactionrole.roleId ? message.guild!.roles.cache.get(reactionrole.roleId) : null;
  if (!role) return error('The role can\'t be found!', message, true);

  // Get the reaction role's author as a member
  const member = await message.guild!.members.fetch(user.id);

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
      if (reactionrole.silent != 'true') msg = await message.channel.send({ content: `✅ **Added ${role.name} role to ${user}**` });
      logger.info(`Added ${role.name} Role to ${user.tag} in ${message.guild!.name}`);
    }
    else {
      // Remove the role from the member
      await member.roles.remove(role);

      // Send message and log
      if (reactionrole.silent != 'true') msg = await message.channel.send({ content: `❌ **Removed ${role.name} role from ${user}**` });
      logger.info(`Removed ${role.name} Role from ${user.tag} in ${message.guild!.name}`);
    }
  }
  else {
    // Add the role to the member
    await member.roles.add(role);

    // Send message and log
    if (reactionrole.silent != 'true') msg = await message.channel.send({ content: `✅ **Added ${role.name} role to ${user}**` });
    logger.info(`Added ${role.name} Role to ${user.tag} in ${message.guild!.name}`);
  }

  // Check if message was sent
  if (!msg) return;

  // Delete the message after 5 seconds
  await sleep(5000);
  await msg.delete().catch(err => logger.error(err));
};