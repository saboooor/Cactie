import { ButtonStyle, CommandInteraction, ModalSubmitInteraction, ButtonInteraction, TextChannel, Message, StringSelectMenuInteraction, AttachmentBuilder, ContainerBuilder, MessageFlags } from 'discord.js';
import { readFileSync } from 'fs';
import { logDate } from '..';

export async function error(err: unknown, message: Message | CommandInteraction | ModalSubmitInteraction | ButtonInteraction | StringSelectMenuInteraction, userError?: boolean) {
  if (`${err}`.includes('Received one or more errors')) console.log(err);
  logger.error(err);

  const client = message.client;

  // Create error message container
  const ErrorContainer = new ContainerBuilder()
    .setAccentColor(userError ? 0xe7a83c : 0xE74C3C)
    .addSectionComponents((section) => section
      .addTextDisplayComponents((textDisplay) =>
        textDisplay.setContent(userError ? '## Invalid command usage' : '## An error has occured!'),
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
    if (message instanceof Message) return await message.reply({ components: [ErrorContainer], flags: MessageFlags.IsComponentsV2 });
    else return await message.reply({ components: [ErrorContainer], flags: MessageFlags.IsComponentsV2 });
  }
  catch (err_1) {
    logger.warn(err_1);
    if (message.channel && 'send' in message.channel)
      message.channel.send({ components: [ErrorContainer], flags: MessageFlags.IsComponentsV2 }).catch(err_2 => logger.warn(err_2));
  }
};