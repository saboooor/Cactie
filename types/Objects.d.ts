import { SlashCommandBuilder, PermissionsBitField, Message, Client, CommandInteraction, ButtonInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction, GuildMember } from "discord.js";

export declare interface Command {
	name?: string;
    description: string;
    category?: string;
    aliases?: string[];
    usage?: string;
    args?: boolean;
    voteOnly?: boolean;
    permissions?: (keyof typeof PermissionsBitField.Flags)[];
    channelPermissions?: (keyof typeof PermissionsBitField.Flags)[];
    botPerms?: (keyof typeof PermissionsBitField.Flags)[];
    botChannelPerms?: (keyof typeof PermissionsBitField.Flags)[];
    cooldown?: number;
	execute: (message: Message, args: string[], client: Client) => void;
}

export declare interface SlashCommand extends Command {
    ephemeral?: boolean;
    noDefer?: boolean;
    options?: (cmd: SlashCommandBuilder) => void;
	execute: (message: CommandInteraction | Message, args: string[], client: Client) => void;
}

export declare interface ContextMenuCommand<T extends 'User' | 'Message'> {
    name: string;
    permissions?: (keyof typeof PermissionsBitField.Flags)[];
    botPerms?: (keyof typeof PermissionsBitField.Flags)[];
    ephemeral?: boolean;
    noDefer?: boolean;
    type: T;
    execute: (interaction: ContextMenuCommandInteraction, client: Client, item: T extends 'User' ? GuildMember : Message) => void
}
  
export declare interface Reaction {
    name?: string;
    triggers: string[];
    additionaltriggers?: string[];
	execute: (message: Message) => void;
}

export declare interface Modal {
	name?: string;
    deferReply?: boolean;
    ephemeral?: boolean;
    execute: (interaction: ModalSubmitInteraction, client: Client, modalInfo: string) => void
}

export declare interface Button {
	name?: string;
    botPerms?: (keyof typeof PermissionsBitField.Flags)[];
    deferReply?: boolean;
    noDefer?: boolean;
    ephemeral?: boolean;
    execute: (interaction: ButtonInteraction, client: Client) => void
}