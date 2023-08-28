import { CommandSleepTTL } from '@/constants/commandSleep'
import { CommandSleepService } from '@/core/commandSleep'
import { APIService } from '@/core/API'
import { FeedbackEvaluation } from '@/types/DBEntity.types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction, Message } from 'discord.js'
import { FeedbackOptions } from './DTO/options.DTO'
import { FeedbackEmbeds } from './resources/feedback.embeds'

@Injectable()
export class FeedbackService {
  private _logger = new Logger(FeedbackService.name)
  private _embeds = new FeedbackEmbeds()
  private _commandSleep = new CommandSleepService()

  constructor(@Inject(APIService) private readonly _apiService: APIService) {}

  async onUseCommand(interaction: ChatInputCommandInteraction, { evaluation, message: userMessage }: FeedbackOptions) {
    this._logger.log('-'.repeat(30))
    this._logger.log('Start: command feedback on use')

    try {
      // Check on sleep before use command, if user is in black list do not use command
      if (this._commandSleep.isMemberInBlackList(interaction.user.id)) {
        await interaction.reply({
          embeds: [this._embeds.errorFeedbackSleepCommand()],
          ephemeral: true,
        })

        throw new Error(`Finally: Command sleep for member.\nMember id: ${interaction.user.id}`)
      }

      const { guildId: guildID } = interaction
      const evaluationTransformed = Number(evaluation) as FeedbackEvaluation

      // Show action bot
      await interaction.deferReply({ ephemeral: true })

      const saveGuild = await this._apiService.guildAPIService.addGuild(guildID)

      if (!saveGuild) {
        interaction.editReply({
          embeds: [this._embeds.error()],
        })

        throw new Error('Failed to save guild')
      }

      // Get feedback channel ID from DB
      const feedbackChannelID = await this._apiService.guildAPIService.getFeedbackChannel(guildID)

      if (!feedbackChannelID) {
        interaction.editReply({
          embeds: [this._embeds.errorFeedbackChannelNotFound()],
        })

        throw new Error('Feedback channel not found')
      }

      // Get feedback channel
      const channel = await interaction.guild.channels.fetch(feedbackChannelID)

      // Check on text type channel
      if (channel?.type !== ChannelType.GuildText) {
        interaction.editReply({
          embeds: [this._embeds.error()],
        })

        throw new Error('Feedback channel is not a text channel')
      }

      // Save feedback
      const feedback = await this._apiService.feedbackAPIService.addFeedback(interaction.user.id, {
        message: userMessage,
        evaluation: evaluationTransformed,
      })

      // If feedback is not saved
      if (!feedback) {
        interaction.editReply({
          embeds: [this._embeds.error()],
        })

        throw new Error('Failed to save feedback')
      }

      // Send feedback
      const message: Message = await channel.send({
        embeds: [this._embeds.feedback(interaction.user, { evaluation: evaluationTransformed, message: userMessage })],
      })

      if (!message) {
        throw new Error('Failed to send feedback')
      }

      this._logger.log('Send feedback', `Member id: ${interaction.user.id}`, `Message id: ${message.id}`, `Channel id: ${channel.id}`)

      // Reply message if message in feedback channel
      interaction.channelId !== feedbackChannelID
        ? interaction.editReply({
            embeds: [this._embeds.successFeedbackLeave(message.channelId, message.id)],
          })
        : interaction.deleteReply()

      // Save member in sleep list for command feedback
      this._commandSleep.addInBlackList(interaction.user.id, { ttl: CommandSleepTTL['6h'] })

      // Update message ID in feedback
      const feedbackUpdate = await this._apiService.feedbackAPIService.updateFeedback(feedback.feedbackID, { messageID: message.id })

      if (!feedbackUpdate) {
        throw new Error('Failed to save feedback in DB')
      }
    } catch (error) {
      this._logger.error(error)
    }
  }
}
