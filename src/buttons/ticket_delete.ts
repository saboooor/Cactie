import { ButtonInteraction, TextChannel } from 'discord.js';
import deleteTicket from '../functions/tickets/deleteTicket';

export const name = 'delete_ticket';
export const botPerms = ['ManageChannels'];
export const deferReply = true;

export async function execute(interaction: ButtonInteraction) {
	// Delete the ticket
	try { await deleteTicket(interaction.channel as TextChannel); }
	catch (err) { error(err, interaction, true); }
}