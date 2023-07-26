import { ConfigService } from '@nestjs/config'
import { IntentsBitField } from 'discord.js'
import { NecordModuleOptions } from 'necord'
import { normalizeTimeStamp } from '../utils/formatting'

export const CLIENT_OPTIONS = (configModule: ConfigService): NecordModuleOptions => {
  return {
    token: configModule.get('TOKEN'),
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildEmojisAndStickers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildMessageTyping,
      IntentsBitField.Flags.MessageContent,
    ],
  }
}

export const BOT_RUNNING_TIMESTAMP = normalizeTimeStamp()
