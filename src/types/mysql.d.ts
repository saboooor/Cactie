export type Table = 'ticketdata' | 'settings' | 'reactionroles' | 'memberdata' | 'lastvoted';

export declare interface ticketData {
    guildId: string;
    channelId: string;
    opener: string;
    resolved: 'true' | 'false';
    users: string;
    voiceticket: string | 'false';
}

export declare interface settings {
    guildId: string;
    prefix: string;
    reactions: 'true' | 'false';
    leavemessage: string | 'false';
    joinmessage: string | 'false';
    maxppsize: string;
    tickets: 'buttons' | 'reactions' | 'false';
    disabledcmds: string | 'false';
    auditlogs: string | 'false';
    suggestionchannel: string | 'false';
    suggestthreads: 'true' | 'false';
    pollchannel: string | 'false';
    logchannel: string | 'false';
    ticketlogchannel: string | 'false';
    ticketcategory: string | 'false';
    supportrole: string | 'false';
    ticketmention: 'here' | 'everyone' | string | 'false';
    mutecmd: 'timeout' | string | 'false';
    msgshortener: string;
    djrole: string | 'false';
}

export declare interface reactionRoles {
    guildId: string;
    channelId: string;
    messageId: string;
    emojiId: string;
    roleId: string;
    type: 'toggle' | 'single';
    silent: 'true' | 'false';
}

export declare interface memberData {
    memberId: string;
    guildId: string;
    mutedUntil: string;
    bannedUntil: string;
    warns: string;
}

export declare interface lastVoted {
    userId: string;
    timestamp: string;
}