import { getUserInfo } from '~/util/misc/userinfo';
import { ContextMenuCommand } from '~/lists/Objects';

export const context: ContextMenuCommand<'User'> = {
  name: 'User Info',
  flags: ['Ephemeral'],
  type: 'User',
  async execute(interaction, _, member) {
    try {
      getUserInfo(member.user, interaction, member);
    }
    catch (err) { error(err, interaction); }
  },
};