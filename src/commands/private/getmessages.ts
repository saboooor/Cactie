import { Command } from 'types/Objects';
import { TextChannel } from 'discord.js';
import getMessages from '../../functions/getMessages';

export const getmessages: Command = {
  description: 'getMessages',
  async execute(message) {
    // Check if user is sab lolololol
    if (message.author.id !== '249638347306303499') return error('You can\'t do that!', message, true);
    const messagechunks = await getMessages(message.channel as TextChannel, 'infinite');
    let messagesize = 0;
    for (const i in messagechunks) messagesize += messagechunks[i].size;
    message.reply(`${messagechunks.length} chunks (${messagesize} total)`);
  },
};