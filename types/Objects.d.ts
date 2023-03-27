import { SlashCommandBuilder, PermissionsBitField } from "discord.js";

export declare interface Command {
	name: string;
    description: string;
    ephemeral?: boolean;
    aliases?: string[];
    usage: string;
    args?: boolean;
    voteOnly?: boolean;
    permissions?: (keyof typeof PermissionsBitField.Flags)[];
    channelPermissions?: (keyof typeof PermissionsBitField.Flags)[];
    botPerms?: (keyof typeof PermissionsBitField.Flags)[];
    botChannelPerms?: (keyof typeof PermissionsBitField.Flags)[];
    cooldown?: number;
    options?: (cmd: SlashCommandBuilder) => void;
	execute: any;
}

export declare interface Reaction {
	name: string;
    description?: string;
    triggers: string[];
    additionaltriggers?: string[];
	execute: any;
}