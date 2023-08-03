import { API } from '@/modules/API'
import { Injectable, Logger } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction } from 'discord.js'
import { SetWelcomeChannelEmbeds } from './resources/setWelcomeChannel.embeds'

@Injectable()
export class SetWelcomeChannelService {
  private _logger = new Logger(SetWelcomeChannelService.name)
  private _embeds = new SetWelcomeChannelEmbeds()

  async onUseCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true })

    // Check on channel type
    if (interaction.channel.type !== ChannelType.GuildText) {
      interaction.editReply({
        embeds: [this._embeds.errorByWrongChannelType()],
      })
      return
    }

    const { guildId: guildID, channelId: channelID } = interaction

    // Create guild if it doesn't exist
    const guildFromBD = await API.guildAPIService.addGuild(guildID)

    if (!guildFromBD) {
      interaction.editReply({
        embeds: [this._embeds.errorBySetWelcomeChannel()],
      })
      return
    }

    // Set welcome channel
    const res = await API.guildAPIService.updateGuild(guildID, {
      welcomeChannelID: channelID,
    })

    // Send result to user
    interaction.editReply({
      embeds: [res ? this._embeds.successSetWelcomeChannel() : this._embeds.errorBySetWelcomeChannel()],
    })
  }
}
