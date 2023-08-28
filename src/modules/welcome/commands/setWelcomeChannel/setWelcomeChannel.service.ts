import { APIService } from '@/core/API'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { ChannelType, ChatInputCommandInteraction, Role } from 'discord.js'
import { SetWelcomeChannelEmbeds } from './resources/setWelcomeChannel.embeds'

@Injectable()
export class SetWelcomeChannelService {
  private _logger = new Logger(SetWelcomeChannelService.name)
  private _embeds = new SetWelcomeChannelEmbeds()

  constructor(@Inject(APIService) private readonly _apiService: APIService) {}

  async onUseCommand(interaction: ChatInputCommandInteraction, role: Role): Promise<void> {
    try {
      this._logger.log('-'.repeat(30))
      this._logger.log('Start: Set welcome channel and welcome role')

      await interaction.deferReply({ ephemeral: true })

      // Check on channel type
      if (interaction.channel.type !== ChannelType.GuildText) {
        interaction.editReply({
          embeds: [this._embeds.errorByWrongChannelType()],
        })

        throw new Error('Error in setting the welcome channel, wrong channel type')
      }

      const { guildId: guildID, channelId: channelID } = interaction

      // Create guild if it doesn't exist
      const guild = await this._apiService.guildAPIService.getGuild(guildID)

      const updatedGuild = !guild
        ? await this._apiService.guildAPIService.addGuild(guildID, {
            welcomeChannelID: channelID,
            welcomeRoleID: role.id,
          })
        : await this._apiService.guildAPIService.updateGuild(guildID, {
            welcomeChannelID: channelID,
            welcomeRoleID: role.id,
          })

      if (!updatedGuild) {
        interaction.editReply({
          embeds: [this._embeds.errorBySetWelcomeChannel()],
        })

        throw new Error('Error in setting the welcome channel and role')
      }

      // Send result to user
      await interaction.editReply({
        embeds: [this._embeds.successSetWelcomeChannel()],
      })

      this._logger.log('Finish set welcome channel and welcome role', `welcomeChannelID: ${channelID}`, `welcomeRoleID: ${role.id}`)
    } catch (error) {
      this._logger.error(error)
    }
  }
}
