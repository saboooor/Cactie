import { ButtonStyle, CommandInteraction, ModalSubmitInteraction, ButtonInteraction, TextChannel, Client, Message, StringSelectMenuInteraction, AttachmentBuilder, ContainerBuilder, MessageFlags } from 'discord.js';
import { readFileSync } from 'fs';
function minTwoDigits(n: number) { return (n < 10 ? '0' : '') + n; }
const logDate = `${minTwoDigits(rn.getMonth() + 1)}-${minTwoDigits(rn.getDate())}-${rn.getFullYear()}`;

export default (client: Client) => {
  // Create a function for error messaging
  global.error = async function error(err: unknown, message: Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction, userError?: boolean) {
    if (`${err}`.includes('Received one or more errors')) console.log(err);
    logger.error(err);

    // Create error message container
    const ErrorContainer = new ContainerBuilder()
      .setAccentColor(0xE74C3C)
      .addSectionComponents((section) => section
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent('# An error has occured!'),
        )
        .setButtonAccessory((btn) => btn
          .setStyle(ButtonStyle.Link)
          .setLabel('Support Server')
          .setURL('https://sova.fyi/discord'),
        ),
      )
      .addSeparatorComponents((separator) => separator)
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(`\`\`\`\n${err}\n\`\`\``),
      );

    // log error in support server if it's not a user error
    if (!userError) {
      ErrorContainer
        .addSeparatorComponents((separator) => separator)
        .addTextDisplayComponents((textDisplay) =>
          textDisplay.setContent('This was most likely an error on our end. Please report this at the Sova Support Discord Server.'),
        );
      const channel = client.guilds.cache.get('811354612547190794')!.channels.cache.get('830013224753561630') as TextChannel;
      const logFile = new AttachmentBuilder(readFileSync(`./logs/${logDate}.log`), { name: `${logDate}.log` });
      channel.send({ files: [logFile], components: [ErrorContainer], flags: MessageFlags.IsComponentsV2 });
    }

    // send error message, if that fails, send it in the channel, if that also fails, log it
    try {
      if (message instanceof Message) return await message.reply({ components: [ErrorContainer] });
      else return await message.reply({ components: [ErrorContainer] });
    }
    catch (err_1) {
      logger.warn(err_1);
      if (message.channel && 'send' in message.channel)
        message.channel.send({ components: [ErrorContainer] }).catch(err_2 => logger.warn(err_2));
    }
  };

  // Log any REST errors (mostly for debugging, since these don't necessarily need to be reported)
  client.rest.on('rateLimited', (info) => logger.warn(`Encountered ${info.method} rate limit!`));

  // Log unhandled promise rejections, but if it's an unknown message/interaction or missing permissions/access error, log the request body instead of the error (since those errors are usually caused by users and the request body can help us debug it faster)
  process.on('unhandledRejection', (reason: any) => {
    if (reason.rawError && (reason.rawError.message == 'Unknown Message' || reason.rawError.message == 'Unknown Interaction' || reason.rawError.message == 'Missing Access' || reason.rawError.message == 'Missing Permissions')) {
      logger.error(JSON.stringify(reason.requestBody));
    }
  });

  logger.info('Error Handler Loaded');
};