import { Client, GuildMember, ModalSubmitInteraction } from 'discord.js';
import createTicket from '../functions/tickets/createTicket';

export const name = 'ticket_create';
export const deferReply = true;
export const ephemeral = true;

export async function execute(interaction: ModalSubmitInteraction, client: Client) {
	try {
		// Check if tickets are disabled
		const srvconfig = await sql.getData('settings', { guildId: interaction.guild!.id });

		if (!(interaction.member instanceof GuildMember)) {
			interaction.member = await interaction.guild!.members.fetch(interaction.member!.user.id);
		}

		// Create a ticket
		const msg = await createTicket(client, srvconfig, interaction.member!, interaction.fields.getTextInputValue('description'));

		// Send the message
		interaction.reply(msg);
	}
	catch (err) { error(err, interaction); }
}