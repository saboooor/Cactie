import { Message } from "discord.js";

export const name = 'simp';
export const triggers = ['lov', 'simp', ' ily ', ' ily', 'kiss', 'cute'];

export function execute(message: Message) {
	message.react('896483408753082379').catch(err => logger.error(err));
};