import { COLORS } from '@/constants'
import { EmbedBuilder } from 'discord.js'

export class SetWelcomeChannelEmbeds {
  successSetWelcomeChannel(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Success',
      description: 'Welcome channel set successfully.',
      color: COLORS.SUCCESS,
    })
  }

  errorBySetWelcomeChannel(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Error in setting the welcome channel.',
      color: COLORS.ERROR,
    })
  }

  errorByWrongChannelType(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Wrong channel type, please use command in text channel.',
      color: COLORS.ERROR,
    })
  }
}
