import { Message } from "discord.js";
import { Reaction } from "types/Objects";

export const cactiebad: Reaction = {
	triggers: ['bad', 'gross', 'shit', 'dum'],
	additionaltriggers: ['cactie'],
	execute: (message: Message) => {
		message.react('🇳').catch(err => logger.error(err));
		message.react('🇴').catch(err => logger.error(err));	
	}
}