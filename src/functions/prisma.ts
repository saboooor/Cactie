import { PrismaClient, settings } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());
logger.info('Prisma client initialized');

export default prisma;

export async function getGuildConfig(guildId: string) {
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
    reactions: JSON.parse(srvconfigUnparsed.reactions),
    auditlogs: JSON.parse(srvconfigUnparsed.auditlogs),
  };

  return srvconfig;
}

export async function getMemberData(memberId: string, guildId: string, ttl: number = 30) {
  const memberdataUnparsed = await prisma.memberdata.findUnique({
    where: { memberId_guildId: { memberId, guildId } },
    cacheStrategy: { ttl },
  });
  if (!memberdataUnparsed) return null;

  const memberdata = {
    ...memberdataUnparsed,
    warns: memberdataUnparsed.warns ? JSON.parse(memberdataUnparsed.warns) : [],
  };

  return memberdata;
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