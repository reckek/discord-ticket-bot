import { API } from '@/modules/API'
import { Injectable, Logger } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction } from 'discord.js'
import { SetChannelFeedbackEmbed } from './resources/setChannelFeedback.embeds'

@Injectable()
export class SetFeedbackChannelService {
  private _embeds = new SetChannelFeedbackEmbed()
  private _logger = new Logger(SetFeedbackChannelService.name)

  public async onUseCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    // Show action bot
    await interaction.deferReply({ ephemeral: true })

    this._logger.log('-'.repeat(30))
    this._logger.log('Start: Set feedback channel')

    // Check on text channel type
    if (interaction.channel.type !== ChannelType.GuildText) {
      interaction.editReply({
        embeds: [this._embeds.errorIncorrectChannelType()],
      })
      this._logger.error('Error in setting the feedback channel, wrong channel type')
      return
    }

    const { guildId: guildID, channelId: channelID } = interaction

    // Create guild if it doesn't exist
    const res = !(await API.guildAPIService.addGuild(guildID))
      ? await API.guildAPIService.addGuild(guildID, {
          feedbackChannelID: channelID,
        })
      : await API.guildAPIService.updateGuild(guildID, {
          feedbackChannelID: channelID,
        })

    if (res) {
      interaction
        .editReply({
          embeds: [this._embeds.successSetChannel()],
        })
        .finally(() => {
          this._logger.log('Finish set feedback channel')
        })
    } else {
      interaction
        .editReply({
          embeds: [this._embeds.errorBySetChannel()],
        })
        .finally(() => {
          this._logger.error('Error in setting the feedback channel')
        })
    }
  }
}
