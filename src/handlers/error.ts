import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, ModalSubmitInteraction, ButtonInteraction, TextChannel, Client, Message, StringSelectMenuInteraction, AttachmentBuilder } from 'discord.js';
import { readFileSync } from 'fs';
function minTwoDigits(n: number) { return (n < 10 ? '0' : '') + n; }
const logDate = `${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}`;

export default (client: Client) => {
  // Create a function for error messaging
  global.error = async function error(err: any, message: Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction, userError?: boolean) {
    if (`${err}`.includes('Received one or more errors')) console.log(err);
    logger.error(err);
    const errEmbed = new EmbedBuilder()
      .setColor(0xE74C3C)
      .setTitle('An error has occured!')
      .setDescription(`\`\`\`\n${err}\n\`\`\``);
    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    if (!userError) {
      errEmbed.setFooter({ text: 'This was most likely an error on our end. Please report this at the Cactie Support Discord Server.' });
      components.push(
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents([
            new ButtonBuilder()
              .setURL('https://luminescent.dev/discord')
              .setLabel('Support Server')
              .setStyle(ButtonStyle.Link),
          ]),
      );
      const channel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630')! as TextChannel;
      const logFile = new AttachmentBuilder(readFileSync(`./logs/${logDate}.log`), { name: `${logDate}.log` });
      channel.send({ embeds: [errEmbed], files: [logFile] });
    }
    try {
      if (message instanceof Message) return await message.reply({ embeds: [errEmbed], components });
      else return await message.reply({ embeds: [errEmbed], components });
    }
    catch (err_1) {
      logger.warn(err_1);
      message.channel?.send({ embeds: [errEmbed], components }).catch(err_2 => logger.warn(err_2));
    }
  };
  client.rest.on('rateLimited', (info) => logger.warn(`Encountered ${info.method} rate limit!`));
  process.on('unhandledRejection', (reason: any) => {
    if (reason.rawError && (reason.rawError.message == 'Unknown Message' || reason.rawError.message == 'Unknown Interaction' || reason.rawError.message == 'Missing Access' || reason.rawError.message == 'Missing Permissions')) {
      logger.error(JSON.stringify(reason.requestBody));
    }
  });
  logger.info('Error Handler Loaded');
};