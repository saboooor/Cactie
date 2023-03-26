import { Snowflake, ChannelResolvable } from "discord.js";

declare interface ticketData {
    guildId: Snowflake;
    channelId: Snowflake;
    opener: Snowflake;
    resolved: 'true' | 'false';
    users: string;
    voiceticket: Snowflake | 'false';
}

declare interface settings {
    guildId: Snowflake;
    prefix: string;
    language: string;
    reactions: 'true' | 'false';
    leavemessage: string | 'false';
    joinmessage: string | 'false';
    maxppsize: number;
    tickets: 'buttons' | 'reactions' | 'false';
    disabledcmds: string | 'false';
    auditlogs: string | 'false';
    suggestionchannel: Snowflake | 'false';
    suggestthreads: 'true' | 'false';
    pollchannel: Snowflake | 'false';
    logchannel: Snowflake | 'false';
    ticketlogchannel: Snowflake | 'false';
    ticketcategory: Snowflake | 'false';
    supportrole: Snowflake | 'false';
    ticketmention: 'here' | 'everyone' | Snowflake | 'false';
    mutecmd: 'timeout' | Snowflake | 'false';
    msgshortener: number;
    djrole: Snowflake | 'false';
}

declare interface reactionRoles {
    guildId: Snowflake;
    channelId: Snowflake;
    messageId: Snowflake;
    emojiId: Snowflake;
    roleId: Snowflake;
    type: 'toggle' | 'single';
    silent: 'true' | 'false';
}

declare interface memberData {
    memberId: Snowflake;
    guildId: Snowflake;
    mutedUntil: string;
    bannedUntil: string;
    warns: string;
}

declare interface memberData {
    memberId: Snowflake;
    guildId: Snowflake;
    mutedUntil: string;
    bannedUntil: string;
    warns: string;
}

declare interface lastVoted {
    userId: Snowflake;
    timestamp: string;
}