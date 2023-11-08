import { PrismaClient, punishments, settings } from '@prisma/client';

const prisma = new PrismaClient();
logger.info('Prisma client initialized');

export default prisma;

export const guildConfigCache = new Map<string, guildConfig>();
export async function getGuildConfig(guildId: string, cache?: boolean) {
  if (cache && guildConfigCache.has(guildId)) return guildConfigCache.get(guildId)!;

  logger.info(`Updating guild config for ${guildId}`);
  const srvconfigUnparsed = await prisma.settings.upsert({
    where: { guildId },
    create: { guildId },
    update: {},
  });

  const srvconfig = {
    ...srvconfigUnparsed,
    joinmessage: JSON.parse(srvconfigUnparsed.joinmessage),
    leavemessage: JSON.parse(srvconfigUnparsed.leavemessage),
    tickets: JSON.parse(srvconfigUnparsed.tickets),
    voicechats: JSON.parse(srvconfigUnparsed.voicechats),
    reactions: JSON.parse(srvconfigUnparsed.reactions),
    auditlogs: JSON.parse(srvconfigUnparsed.auditlogs),
  };

  guildConfigCache.set(guildId, srvconfig);
  return srvconfig;
}

type parsedPunishments = punishments & {
  warns: any[]
  polls: any[]
}

export async function getPunishments(memberId: string, guildId: string, ttl: number, upsert: true): Promise<parsedPunishments>
export async function getPunishments(memberId: string, guildId: string, ttl?: number, upsert?: boolean): Promise<parsedPunishments | null>
export async function getPunishments(memberId: string, guildId: string, ttl: number = 30, upsert?: boolean) {
  let punishmentsUnparsed;

  if (!upsert) {
    punishmentsUnparsed = await prisma.punishments.findUnique({
      where: { memberId_guildId: { memberId, guildId } },
      cacheStrategy: { ttl },
    });
    if (!punishmentsUnparsed) return null;
  }
  else {
    punishmentsUnparsed = await prisma.punishments.upsert({
      where: { memberId_guildId: { memberId, guildId } },
      create: { memberId, guildId },
      update: {},
    });
  }

  const punishments = {
    ...punishmentsUnparsed,
    warns: JSON.parse(punishmentsUnparsed.warns),
    polls: JSON.parse(punishmentsUnparsed.polls),
  };

  return punishments;
}

export type guildConfig = settings & {
  joinmessage: {
    message: string;
    channel: string;
  };
  leavemessage: {
    message: string;
    channel: string;
  }
  tickets: {
    enabled: boolean;
    type: 'buttons' | 'reactions';
    logchannel: 'false' | string;
    category: 'false' | string;
    role: 'false' | string;
    mention: 'everyone' | 'here' | 'false' | string;
    count: number | 'false';
  }
  reactions: {
    regex: string;
    emojis: string[];
  }[]
  auditlogs: {
    channel: 'false' | string;
    logs: {
      [log: string]: {
        channel: 'false' | string;
      }
    }
  };
}