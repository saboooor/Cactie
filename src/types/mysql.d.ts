export type Table = 'ticketdata' | 'settings' | 'reactionroles' | 'memberdata' | 'lastvoted';

export class ticketData {
  guildId: string;
  channelId: string;
  opener: string;
  resolved: 'true' | 'false';
  users: string;
  voiceticket: string | 'false';
}

export class settings {
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

export class reactionRoles {
  guildId: string;
  channelId: string | null;
  messageId: string | null;
  emojiId: string | null;
  roleId: string | null;
  type: 'toggle' | 'switch';
  silent: 'true' | 'false';
}

export class memberData {
  memberId: string;
  guildId: string;
  mutedUntil: string | null;
  bannedUntil: string | null;
  warns: string | null;
}

export class lastVoted {
  userId: string;
  timestamp: string;
}