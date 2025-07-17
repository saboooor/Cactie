-- CreateTable
CREATE TABLE `tickets` (
    `guildId` TEXT NOT NULL,
    `channelId` TEXT NOT NULL,
    `opener` TEXT NOT NULL,
    `resolved` TEXT NOT NULL DEFAULT 'false',
    `users` TEXT NOT NULL,
    `voiceticket` TEXT NOT NULL DEFAULT 'false',

    UNIQUE INDEX `channelId`(`channelId`(191)),
    UNIQUE INDEX `noChannelId`(`opener`(191), `guildId`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `guildId` TEXT NOT NULL,
    `reactions` TEXT NOT NULL DEFAULT '[{"regex":"/(?=.*\\\b(bad|gross|shit|dum)\\\b)(?=.*\\\bcactie\\\b).*/i","emojis":["?","?"]},{"regex":"/\\\b(mad|madd|angry|angri|kill|punch|evil)(er|ing|s)?\\\b/i","emojis":["899340907432792105"]},{"regex":"/shoto/i","emojis":["867259182642102303","?"]},{"regex":"/\\\b(love|lov|ily|simp|kiss|cute)(t|r|er|ing|s)?\\\b/i","emojis":["896483408753082379"]}]',
    `leavemessage` TEXT NOT NULL DEFAULT '{"message":"","channel":"false"}',
    `joinmessage` TEXT NOT NULL DEFAULT '{"message":"","channel":"false"}',
    `tickets` TEXT NOT NULL DEFAULT '{"enabled":true,"type":"buttons","logchannel":"false","category":"false","role":"false","mention":"here","count":1}',
    `voicechats` TEXT NOT NULL DEFAULT '{"type":"private","category":"false"}',
    `auditlogs` TEXT NOT NULL DEFAULT '{"channel":"false","logs":{}}',
    `suggestionchannel` TEXT NOT NULL DEFAULT 'false',
    `suggestthreads` TEXT NOT NULL DEFAULT 'true',
    `pollchannel` TEXT NOT NULL DEFAULT 'false',
    `logchannel` TEXT NOT NULL DEFAULT 'false',
    `mutecmd` TEXT NOT NULL DEFAULT 'timeout',
    `msgshortener` INTEGER NOT NULL DEFAULT 30,

    UNIQUE INDEX `guildId`(`guildId`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reactionroles` (
    `guildId` TEXT NOT NULL,
    `channelId` TEXT NOT NULL,
    `messageId` TEXT NOT NULL,
    `emojiId` TEXT NOT NULL,
    `roleId` TEXT NOT NULL,
    `type` TEXT NOT NULL DEFAULT 'toggle',
    `silent` TEXT NOT NULL DEFAULT 'false',

    UNIQUE INDEX `Identifier`(`messageId`(191), `emojiId`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customcmds` (
    `id` TEXT NOT NULL,
    `guildId` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `description` TEXT NOT NULL DEFAULT 'A custom command',
    `actions` TEXT NOT NULL DEFAULT '[]',

    UNIQUE INDEX `id`(`id`(191)),
    UNIQUE INDEX `guildId`(`guildId`(191), `name`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `punishments` (
    `memberId` TEXT NOT NULL,
    `guildId` TEXT NOT NULL,
    `mutedUntil` DATETIME(0) NULL,
    `bannedUntil` DATETIME(0) NULL,
    `warns` TEXT NOT NULL DEFAULT '[]',

    UNIQUE INDEX `Identifier`(`memberId`(191), `guildId`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `temppolls` (
    `channelId` TEXT NOT NULL,
    `messageId` TEXT NOT NULL,
    `expiresAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `messageId`(`messageId`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voicechats` (
    `channelId` TEXT NOT NULL,
    `guildId` TEXT NOT NULL,
    `ownerId` TEXT NOT NULL,

    INDEX `Id`(`channelId`(191)),
    UNIQUE INDEX `guildId`(`guildId`(191), `ownerId`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `sessionId` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `refreshToken` TEXT NULL,
    `expiresAt` DATETIME(0) NULL,
    `scope` TEXT NULL,
    `pfp` TEXT NULL DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    `accent` TEXT NULL,

    UNIQUE INDEX `sessionId`(`sessionId`),
    UNIQUE INDEX `accessToken`(`accessToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
