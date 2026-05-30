import { SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';

export const SomeoneOption = (option: SlashCommandStringOption) => option
  .setName('someone')
  .setDescription('Pick someone or something to use this command on');
export const UserOption = (option: SlashCommandUserOption) => option
  .setName('user')
  .setDescription('Pick a user to use this command on');