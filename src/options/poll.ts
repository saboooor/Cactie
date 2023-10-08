import { SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';

export default async function options(cmd: SlashCommandBuilder) {
  cmd.addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
      .setName('create')
      .setDescription('Create a poll')
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName('yesno')
          .setDescription('Create a poll with yes/no options')
          .addStringOption(
            new SlashCommandStringOption()
              .setName('question')
              .setDescription('The question to ask')
              .setRequired(true),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('timer')
              .setDescription('Time to keep the poll open until s/m/h/d/mo (Ex. 10s, 2m)'),
          ),
      )
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName('multiple')
          .setDescription('Create a poll with multiple choice options')
          .addStringOption(
            new SlashCommandStringOption()
              .setName('question')
              .setDescription('The question to ask')
              .setRequired(true),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice1')
              .setDescription('The first choice')
              .setRequired(true),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice2')
              .setDescription('The second choice')
              .setRequired(true),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice3')
              .setDescription('The third choice'),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice4')
              .setDescription('The fourth choice'),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice5')
              .setDescription('The fifth choice'),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice6')
              .setDescription('The sixth choice'),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice7')
              .setDescription('The seventh choice'),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('choice8')
              .setDescription('The eighth choice'),
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName('timer')
              .setDescription('Time to keep the poll open until s/m/h/d/mo (Ex. 10s, 2m)'),
          ),
      ),
  ).addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('end')
      .setDescription('End a poll')
      .addStringOption(
        new SlashCommandStringOption()
          .setName('messageid')
          .setDescription('The Id of the poll message')
          .setRequired(true)
          .setAutocomplete(true),
      ),
  );
}