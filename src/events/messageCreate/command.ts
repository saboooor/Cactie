import { Client, Message } from 'discord.js';
import checkPerms, { PermissionChannel } from '~/functions/checkPerms';
import commands from '~/lists/private';

export default async (client: Client, message: Message<true>) => {
  // If the bot can't read message history or send messages, don't execute a command
  if (message.webhookId || message.author.bot) return;
  if (!message.guild) return;
  const initialPermCheck = checkPerms(['SendMessages', 'ReadMessageHistory'], message.guild.members.me!, message.channel as PermissionChannel);
  if (initialPermCheck) return;

  // If message doesn't start with the prefix, return
  if (!message.content.startsWith(`${client.user}`)) return;

  // Get args by splitting the message by the spaces and getting rid of the prefix
  const args = message.content.split(' ');
  args.shift();
  if (!args[0]) return;

  // Get the command name from the first arg and get rid of the first arg
  const commandName = args.shift()?.toLowerCase();

  // Get the command from the commandName, if it doesn't exist, return
  const command = commands.get(commandName ?? '');
  if (!command) {
    const himsg = await message.reply({ content: `## Hi! I'm ${client.user?.username}\nDo a /help command for help!` });
    setTimeout(() => { himsg.delete().catch(err => logger.error(err)); }, 10000);
    return;
  }

  // Check if user has dev in Luminescent Discord Server
  const luminescent = client.guilds.cache.get('811354612547190794')!;
  const luminescentMember = luminescent.members.cache.get(message.member!.id);
  if (luminescentMember ? !luminescentMember.roles.cache.has('839158574138523689') : true) return;

  // Log
  logger.info(`${message.author.username} issued message command: ${message.content}, in ${message.guild.name}`);

  // execute the command
  try { command.execute(message, args, client); }
  catch (err) {
    message.reply('This command has ran into an error.');
    logger.error(err);
  }
};