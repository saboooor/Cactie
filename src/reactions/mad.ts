import { Reaction } from "types/Objects";

export const mad: Reaction = {
	triggers: ['mad', 'angry', 'kill ', 'punch', 'evil'],
	additionaltriggers: ['cactie'],
	execute: (message) => {
		message.react('899340907432792105').catch(err => logger.error(err));
	}
}