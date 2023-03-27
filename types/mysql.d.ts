import { Snowflake } from "discord.js";

export type Table = 'ticketdata' | 'settings' | 'reactionroles' | 'memberdata' | 'lastvoted';

export declare interface ticketData {
    guildId: Snowflake;
    channelId: Snowflake;
    opener: Snowflake;
    resolved: 'true' | 'false';
    users: string;
    voiceticket: Snowflake | 'false';
}

export declare interface settings {
    guildId: Snowflake;
    prefix: string;
    reactions: 'true' | 'false';
    leavemessage: string | 'false';
    joinmessage: string | 'false';
    maxppsize: string;
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
    msgshortener: string;
    djrole: Snowflake | 'false';
}

export declare interface reactionRoles {
    guildId: Snowflake;
    channelId: Snowflake;
    messageId: Snowflake;
    emojiId: Snowflake;
    roleId: Snowflake;
    type: 'toggle' | 'single';
    silent: 'true' | 'false';
}

export declare interface memberData {
    memberId: Snowflake;
    guildId: Snowflake;
    mutedUntil: string;
    bannedUntil: string;
    warns: string;
}

export declare interface lastVoted {
    userId: Snowflake;
    timestamp: string;
}