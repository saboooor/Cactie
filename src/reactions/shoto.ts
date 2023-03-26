import { Message } from "discord.js";

export const name = 'shoto';
export const description = '😩';
export const triggers = ['shoto'];

export function execute(message: Message) {
	message.react('867259182642102303').catch(err => logger.error(err));
	message.react('😩').catch(err => logger.error(err));
};