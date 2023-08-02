import { COLORS } from '@/constants'
import { IFeedbackEntity } from '@/types'
import { EmbedBuilder, Snowflake, User, messageLink } from 'discord.js'

export class FeedbackEmbeds {
  feedback(user: User, ticket: Pick<IFeedbackEntity, 'evaluation' | 'message'>): EmbedBuilder {
    let evaluationFormatting: string

    switch (ticket.evaluation) {
      case 1:
        evaluationFormatting = '⭐'
        break
      case 2:
        evaluationFormatting = '⭐⭐'
        break
      case 3:
        evaluationFormatting = '⭐⭐⭐'
        break
      case 4:
        evaluationFormatting = '⭐⭐⭐⭐'
        break
      case 5:
        evaluationFormatting = '⭐⭐⭐⭐⭐'
        break
      default: {
        evaluationFormatting = '⭐⭐⭐'
      }
    }

    return new EmbedBuilder({
      title: `⭐ Review by ${user.username}`,
      description: `
> ### Evaluation of support work:
> ${evaluationFormatting}

> ### Commentary:
> \`\`\`
> ${ticket.message}
> \`\`\`
      `,
      color: COLORS.INFO,
    })
  }

  successFeedbackLeave(channelID: Snowflake, messageID: Snowflake): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Success',
      description: `Thank you for your feedback! Your feedback: ${messageLink(channelID, messageID)}`,
      color: COLORS.SUCCESS,
    })
  }

  error() {
    return new EmbedBuilder({
      title: 'Error',
      description: 'We apologize, an error has occurred, please try again or contact the server owner!',
      color: COLORS.ERROR,
    })
  }

  errorFeedbackChannelNotFound(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Feedback channel not found!',
      color: COLORS.ERROR,
    })
  }

  errorFeedbackSleepCommand(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'You have recently left a feedback, wait a while and leave a new feedback!',
      color: COLORS.ERROR,
    })
  }
}
