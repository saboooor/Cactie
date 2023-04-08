import { ButtonInteraction, TextChannel } from 'discord.js';
import deleteTicket from '../functions/tickets/deleteTicket';

export const delete_ticket = {
	botPerms: ['ManageChannels'],
	deferReply: true,
	execute: async (interaction: ButtonInteraction) => {
		// Delete the ticket
		try { await deleteTicket(interaction.channel as TextChannel); }
		catch (err) { error(err, interaction, true); }
	}
};