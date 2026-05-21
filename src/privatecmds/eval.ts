import { PrivateCommand } from '~/types/Objects';
import util from 'util';

export const ec: PrivateCommand = {
  description: 'Runs code specified in args',
  async execute(message, args) {
    try {
      const code = args.join(' ');
      let evaled = eval(code);
      if (typeof evaled !== 'string') { evaled = util.inspect(evaled); }
      message.reply({ content: evaled });
    }
    catch (err) { error(err, message, true); }
  },
};
