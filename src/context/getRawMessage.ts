import { createPaste } from 'hastebin';
import { ContextMenuCommand } from '~/types/Objects';

export const context: ContextMenuCommand<'Message'> = {
  name: 'Get Raw Message',
  ephemeral: true,
  type: 'Message',
  async execute(interaction, client, message) {
    try {
      // Get content and check if it exists
      if (!message.content) {
        interaction.reply({ content: 'There is no text in this message!' });
        return;
      }

      // Set the content
      let content = `\`\`\`md\n${message.content}\n\`\`\``;

      // If the json string is too long, put it in hastebin
      if (content.length > 2000) content = await createPaste(content, { server: 'https://bin.birdflop.com' });

      // Send the content
      interaction.reply({ content });
    }
    catch (err) { error(err, interaction); }
  },
};