import { SlashCommandBuilder, PermissionsBitField, Message, Client, ButtonInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction, GuildMember, StringSelectMenuInteraction, AutocompleteInteraction, ChatInputCommandInteraction, CacheType } from 'discord.js';

export class Command {
  name?: string;
  description: string;
  execute: (message: Message<true>, args: string[], client: Client<true>) => void | Promise<void>;
}

export class SlashCommand<Cached extends CacheType = CacheType> extends Command {
  ephemeral?: boolean;
  noDefer?: boolean;
  category?: string;
  voteOnly?: boolean;
  cooldown?: number;
  permission?: keyof typeof PermissionsBitField.Flags;
  channelPermissions?: (keyof typeof PermissionsBitField.Flags)[];
  botPerms?: (keyof typeof PermissionsBitField.Flags)[];
  botChannelPerms?: (keyof typeof PermissionsBitField.Flags)[];
  dms?: boolean;
  options?: (cmd: SlashCommandBuilder) => void | Promise<void>;
  autoComplete?: (client: Client<true>, interaction: AutocompleteInteraction<Cached>) => void | Promise<void>;
  execute: (interaction: ChatInputCommandInteraction<Cached>, client: Client<true>) => void | Promise<void>;
}

export class ContextMenuCommand<T extends 'User' | 'Message'> {
  name: string;
  permission?: keyof typeof PermissionsBitField.Flags;
  botPerms?: (keyof typeof PermissionsBitField.Flags)[];
  ephemeral?: boolean;
  noDefer?: boolean;
  type: T;
  execute: (interaction: ContextMenuCommandInteraction<'cached'>, client: Client<true>, item: T extends 'User' ? GuildMember : Message<true>) => void | Promise<void>;
}

export class Modal<Cached extends CacheType = CacheType> {
  name?: string;
  deferReply?: boolean;
  ephemeral?: boolean;
  execute: (interaction: ModalSubmitInteraction<Cached>, client: Client<true>, modalInfo: string) => void | Promise<void>;
}

export class Button<Cached extends CacheType = CacheType> {
  name?: string;
  botPerms?: (keyof typeof PermissionsBitField.Flags)[];
  deferReply?: boolean;
  noDefer?: boolean;
  ephemeral?: boolean;
  execute: (interaction: ButtonInteraction<Cached> | StringSelectMenuInteraction<Cached>, client: Client<true>) => void | Promise<void>;
}