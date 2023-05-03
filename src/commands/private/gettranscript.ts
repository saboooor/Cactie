import { Command } from '~/types/Objects';
import getTranscript from '~/functions/messages/getTranscript';

export const gettranscript: Command = {
  description: 'getTranscript',
  async execute(message) {
    // Check if user is sab lolololol
    if (message.author.id !== '249638347306303499') return;
    const messages = await message.channel.messages.fetch({ limit: 100 });
    const url = await getTranscript(messages);
    message.reply(url);
  },
};