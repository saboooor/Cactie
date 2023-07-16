import { SlashCommandSubcommandBuilder, SlashCommandChannelOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import * as helpdesc from '~/misc/helpdesc';

export default async function options(cmd: SlashCommandBuilder) {
  const categories = Object.keys(helpdesc) as (keyof typeof helpdesc)[];
  categories.forEach(category => {
    const subcmd = new SlashCommandSubcommandBuilder()
      .setName(category)
      .setDescription(helpdesc[category].description);
    if (category == 'supportpanel') {
      subcmd.addChannelOption(
        new SlashCommandChannelOption()
          .setName('channel')
          .setDescription('The channel to send the support panel to'),
      ).addStringOption(
        new SlashCommandStringOption()
          .setName('title')
          .setDescription('The title of the support panel'),
      ).addStringOption(
        new SlashCommandStringOption()
          .setName('description')
          .setDescription('The description of the support panel'),
      ).addStringOption(
        new SlashCommandStringOption()
          .setName('footer')
          .setDescription('The footer of the support panel'),
      );
    }
    cmd.addSubcommand(subcmd);
  });
}