import { API } from '@/modules/API'
import { Injectable } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction } from 'discord.js'
import { SetChannelFeedbackEmbed } from './resources/setChannelFeedback.embeds'

@Injectable()
export class SetFeedbackChannelService {
  private _embeds = new SetChannelFeedbackEmbed()

  public async onUseCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    // Show action bot
    await interaction.deferReply({ ephemeral: true })

    // Check on text channel type
    if (interaction.channel.type !== ChannelType.GuildText) {
      interaction.editReply({
        embeds: [this._embeds.errorIncorrectChannelType()],
      })

      return
    }

    const { guildId: guildID, channelId: channelID } = interaction

    // Update feedback channel
    const res = await API.guildAPIService.updateGuild(guildID, {
      feedbackChannelID: channelID,
    })

    if (res) {
      interaction.editReply({
        embeds: [this._embeds.successSetChannel()],
      })
    } else {
      interaction.editReply({
        embeds: [this._embeds.errorBySetChannel()],
      })
    }
  }
}
