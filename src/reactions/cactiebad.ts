import { Message } from "discord.js";

export const name = 'cactiebad';
export const triggers = ['bad', 'gross', 'shit', 'dum'];
export const additionaltriggers = ['cactie'];

export function execute(message: Message) {
	message.react('🇳').catch(err => logger.error(err));
	message.react('🇴').catch(err => logger.error(err));
};