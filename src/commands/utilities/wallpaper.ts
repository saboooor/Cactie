import { SlashCommand } from '~/types/Objects';
import redditFetch from '~/functions/redditFetch';

export const wallpaper: SlashCommand = {
  description: 'Get a fresh new wallpaper!',
  async execute(message, args, client) {
    try { redditFetch(['wallpaper', 'wallpapers', 'wallpaperdump'], message, client); }
    catch (err) { error(err, message); }
  },
};