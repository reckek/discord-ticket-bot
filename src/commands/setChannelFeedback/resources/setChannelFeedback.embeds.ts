import { COLORS } from '@/constants'
import { EmbedBuilder } from 'discord.js'

export class SetChannelFeedbackEmbed {
  public successSetChannel(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Success',
      description: 'The channel has been set successfully.',
      color: COLORS.SUCCESS,
    })
  }

  public errorIncorrectChannelType(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Wrong channel type, please use command in text channel.',
      color: COLORS.ERROR,
    })
  }

  public errorBySetChannel(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Error in setting the channel.',
      color: COLORS.ERROR,
    })
  }
}
