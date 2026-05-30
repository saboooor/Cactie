import { Command } from '~/lists/Objects';
import { GuildMember } from 'discord.js';
import userOption from '~/options/user';
import { getUserInfo } from '~/util/misc/userinfo';

export const userinfo: Command = {
  description: 'Get a user\'s information',
  options: userOption,
  async execute(interaction) {
    try {
      let member = interaction.options.getMember('user') ?? interaction.member;
      if (!(member instanceof GuildMember)) member = null;

      let user = interaction.options.getUser('user') ?? interaction.user;
      user = await user.fetch();

      getUserInfo(user, interaction, member);
    }
    catch (err) { error(err, interaction); }
  },
};