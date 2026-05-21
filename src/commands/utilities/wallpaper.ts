import { Command } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const wallpaper: Command = {
  description: 'Get a fresh new wallpaper!',
  async execute(interaction, client) {
    try { redditFetch(['wallpaper', 'wallpapers', 'wallpaperdump'], interaction, client); }
    catch (err) { error(err, interaction); }
  },
};