import { Message } from "discord.js";
import { Reaction } from "types/Objects";

export const simp: Reaction = {
	triggers: ['lov', 'simp', ' ily ', ' ily', 'kiss', 'cute'],
	execute: (message: Message) => {
		message.react('896483408753082379').catch(err => logger.error(err));
	}
}