import { API } from '@/modules/API'
import { Injectable, Logger } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction, Role } from 'discord.js'
import { SetWelcomeChannelEmbeds } from './resources/setWelcomeChannel.embeds'

@Injectable()
export class SetWelcomeChannelService {
  private _logger = new Logger(SetWelcomeChannelService.name)
  private _embeds = new SetWelcomeChannelEmbeds()

  async onUseCommand(interaction: ChatInputCommandInteraction, role: Role): Promise<void> {
    await interaction.deferReply({ ephemeral: true })

    this._logger.log('Start set welcome channel and welcome role')

    // Check on channel type
    if (interaction.channel.type !== ChannelType.GuildText) {
      interaction.editReply({
        embeds: [this._embeds.errorByWrongChannelType()],
      })
      this._logger.error('Error in setting the welcome channel, wrong channel type')
      return
    }

    const { guildId: guildID, channelId: channelID } = interaction

    // Create guild if it doesn't exist
    const guildFromBD = !(await API.guildAPIService.getGuild(guildID))
      ? await API.guildAPIService.addGuild(guildID, {
          welcomeChannelID: channelID,
          welcomeRoleID: role.id,
        })
      : await API.guildAPIService.updateGuild(guildID, {
          welcomeChannelID: channelID,
          welcomeRoleID: role.id,
        })

    if (!guildFromBD) {
      interaction.editReply({
        embeds: [this._embeds.errorBySetWelcomeChannel()],
      })
      this._logger.error('Error in setting the welcome channel and role')
      return
    }

    // Send result to user
    interaction
      .editReply({
        embeds: [this._embeds.successSetWelcomeChannel()],
      })
      .finally(() =>
        this._logger.log('Finish set welcome channel and welcome role', `welcomeChannelID: ${channelID}`, `welcomeRoleID: ${role.id}`),
      )
  }
}
