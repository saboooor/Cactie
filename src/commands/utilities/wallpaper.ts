import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const wallpaper: SlashCommand = {
  description: 'Get a fresh new wallpaper!',
  async execute(interaction, args, client) {
    try { redditFetch(['wallpaper', 'wallpapers', 'wallpaperdump'], interaction, client); }
    catch (err) { error(err, interaction); }
  },
};