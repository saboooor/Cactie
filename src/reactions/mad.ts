import { Message } from "discord.js";

export const name = 'mad';
export const triggers = ['mad', 'angry', 'kill ', 'punch', 'evil'];

export function execute(message: Message) {
	message.react('899340907432792105').catch(err => logger.error(err));
};