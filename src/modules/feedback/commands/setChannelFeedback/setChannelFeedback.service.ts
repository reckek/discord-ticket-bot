import { APIService } from '@/core/API'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction } from 'discord.js'
import { SetChannelFeedbackEmbed } from './resources/setChannelFeedback.embeds'

@Injectable()
export class SetFeedbackChannelService {
  private _embeds = new SetChannelFeedbackEmbed()
  private _logger = new Logger(SetFeedbackChannelService.name)

  constructor(@Inject(APIService) private readonly _apiService: APIService) {}

  public async onUseCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    try {
      this._logger.log('-'.repeat(30))
      this._logger.log('Start: Set feedback channel')

      await interaction.deferReply({ ephemeral: true })

      // Check on text channel type
      if (interaction.channel.type !== ChannelType.GuildText) {
        interaction.editReply({
          embeds: [this._embeds.errorIncorrectChannelType()],
        })

        throw new Error('Error in setting the feedback channel, wrong channel type')
      }

      const { guildId: guildID, channelId: channelID } = interaction

      // Create guild if it doesn't exist
      const res = !(await this._apiService.guildAPIService.addGuild(guildID))
        ? await this._apiService.guildAPIService.addGuild(guildID, {
            feedbackChannelID: channelID,
          })
        : await this._apiService.guildAPIService.updateGuild(guildID, {
            feedbackChannelID: channelID,
          })

      if (!res) {
        interaction.editReply({
          embeds: [this._embeds.errorBySetChannel()],
        })

        throw new Error('Error in setting the feedback channel')
      }

      interaction.editReply({
        embeds: [this._embeds.successSetChannel()],
      })

      this._logger.log('Finish set feedback channel')
    } catch (error) {
      this._logger.error(error)
    }
  }
}
