import { Command } from '~/types/Objects';
import getMessages from '~/functions/getMessages';

export const getmessages: Command = {
  description: 'getMessages',
  async execute(message) {
    // Check if user is sab lolololol
    if (message.author.id !== '249638347306303499') return;
    const messagechunks = await getMessages(message.channel, 'infinite');
    let messagesize = 0;
    for (const i in messagechunks) messagesize += messagechunks[i].size;
    message.reply(`${messagechunks.length} chunks (${messagesize} total)`);
  },
};