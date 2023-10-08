import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildTextBasedChannel } from 'discord.js';
import { yes, no } from '~/misc/emoji.json';
import checkPerms from '~/functions/checkPerms';
import { SlashCommand } from '~/types/Objects';
import vcOptions from '~/options/voicechat';
import { getGuildConfig } from '~/functions/prisma';

export const voicechat: SlashCommand<'cached'> = {
  description: 'Create a personal voice chat!',
  ephemeral: true,
  cooldown: 10,
  options: vcOptions,
  async autoComplete(client, interaction) {
    interaction.respond([]);
  },
  async execute(interaction, client) {
    try {
    }
    catch (err) { error(err, interaction); }
  },
};