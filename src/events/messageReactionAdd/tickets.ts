import checkPerms from '../../functions/checkPerms';
import createTicket from '../../functions/tickets/createTicket';
import closeTicket from '../../functions/tickets/closeTicket';
import deleteTicket from '../../functions/tickets/deleteTicket';
import reopenTicket from '../../functions/tickets/reopenTicket';
import createVoice from '../../functions/tickets/createVoice';
import { Client, MessageReaction, TextChannel, User } from 'discord.js';

export default async (client: Client, reaction: MessageReaction, user: User) => {
  // Check if author is a bot or guild is undefined
  if (user.bot || !reaction.message.guildId) return;

  // Get the guild of the reaction
  const guild = await client.guilds.fetch(reaction.message.guildId);

  // Check if the bot has permission to manage messages
  const permCheck = checkPerms(['ReadMessageHistory'], guild.members.me!, reaction.message.channelId);
  if (permCheck) return;

  // Fetch the reaction's message
  const message = await reaction.message.fetch().catch(err => { logger.error(err); return null; });
  if (!message) return;

  // Get the reaction's emoji
  const emojiId = reaction.emoji.id ?? reaction.emoji.name;

  // Get the member
  const member = await guild.members.fetch(user.id).catch(err => { logger.error(err); return null; });
  if (!member) return;

  // Get current settings for the guild and check if tickets are enabled
  const srvconfig = await sql.getData('settings', { guildId: guild.id });
  if (!srvconfig.tickets) return;

  try {
    if (emojiId == '🎫') {
      if (message.embeds[0] && message.embeds[0].title !== 'Need help? No problem!') return;
      await createTicket(client, srvconfig, member);
      await reaction.users.remove(member.id);
    }
    else if (emojiId == '⛔') {
      await deleteTicket(message.channel as TextChannel);
    }
    else if (emojiId == '🔓') {
      await reopenTicket(srvconfig, member, message.channel as TextChannel);
      await reaction.users.remove(member.id);
    }
    else if (emojiId == '🔒') {
      if (message.embeds[0] && message.embeds[0].title !== 'Ticket Created') return;
      await closeTicket(srvconfig, member, message.channel as TextChannel);
      await reaction.users.remove(member.id);
    }
    else if (emojiId == '🔊') {
      if (message.embeds[0] && message.embeds[0].title !== 'Ticket Created') return;
      await createVoice(client, srvconfig, member, message.channel as TextChannel);
      await reaction.users.remove(member.id);
    }
  }
  catch (err) {
    const msg = await error(err, message, true);
    if (!msg) return;
    await sleep(5000);
    await msg.delete();
  }
};