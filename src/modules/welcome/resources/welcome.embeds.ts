import { COLORS } from '@/constants'
import { EmbedBuilder, Snowflake, bold, channelMention } from 'discord.js'

export class WelcomeEmbeds {
  onMemberAdd(ticketChannelID?: Snowflake): EmbedBuilder {
    return new EmbedBuilder({
      title: bold("I'm glad to see you on my server. Let me give you a little tour."),
      description: `
> 1. In the ${channelMention('1088083979741175869')} - channel you can see my previous works.
${ticketChannelID ? `> 2. Here ⁠${channelMention(ticketChannelID)} you might open a ticket.` : ''}
      `,
      color: COLORS.INFO,
    })
  }
}
