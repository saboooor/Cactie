import { SlashCommand } from 'types/Objects';
import action from '../../functions/action';
import someonereq from '../../options/someonereq';
import { GuildMember } from 'discord.js';

export const bite: SlashCommand = {
	description: 'Bite someone!',
	usage: '<Someone>',
	args: true,
	options: someonereq,
	async execute(message, args) {
		try { action(message, message.member as GuildMember, args, 'bite'); }
		catch (err) { error(err, message); }
	},
};