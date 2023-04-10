import { Client, Guild } from "discord.js";

export default async (client: Client, guild: Guild) => {
	if (!guild.available) return;
	sql.delData('settings', { guildId: guild.id });
	sql.delData('reactionroles', { guildId: guild.id });
	sql.delData('memberdata', { guildId: guild.id });
	sql.delData('ticketdata', { guildId: guild.id });
	logger.info(`${client.user?.username} has been removed from ${guild.name}`);
};