import { SlashCommandSubcommandBuilder, SlashCommandChannelOption, SlashCommandBuilder } from 'discord.js';
import helpdesc from '../misc/helpdesc.json';

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
      );
    }
    cmd.addSubcommand(subcmd);
  });
}