import { ButtonInteraction, GuildMember, TextChannel } from 'discord.js';
import closeTicket from '../functions/tickets/closeTicket';

export const name = 'close_ticket';
export const botPerms = ['ManageChannels'];
export const deferReply = true;
export const ephemeral = true;

export async function execute(interaction: ButtonInteraction) {
	try {
		// Check if tickets are disabled
		const srvconfig = await sql.getData('settings', { guildId: interaction.guild!.id });

		if (!(interaction.member instanceof GuildMember)) {
			interaction.member = await interaction.guild!.members.fetch(interaction.member!.user.id);
		}

		// Create a ticket
		const msg = await closeTicket(srvconfig, interaction.member, interaction.channel as TextChannel);

		// Send the message
		interaction.reply(msg);
	}
	catch (err) { error(err, interaction, true); }
}