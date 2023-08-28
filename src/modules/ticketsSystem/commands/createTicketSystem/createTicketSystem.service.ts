import { APIService } from '@/core/API'
import { ChannelType, ChatInputCommandInteraction, Role } from 'discord.js'
import { CreateTicketSystemComponents } from './resources/createTicketSystem.components'
import { CreateTicketSystemEmbeds } from './resources/createTicketSystem.embeds'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class CreateTicketSystemService {
  private _embeds = new CreateTicketSystemEmbeds()
  private _components = new CreateTicketSystemComponents()
  private _logger = new Logger(CreateTicketSystemService.name)

  constructor(@Inject(APIService) private readonly _apiService: APIService) {}

  async onUseCommand(interaction: ChatInputCommandInteraction, role: Role) {
    try {
      this._logger.log('-'.repeat(30))
      this._logger.log('Start create ticket system')

      await interaction.deferReply({ ephemeral: true })

      // Check on channel type
      if (interaction.channel.type !== ChannelType.GuildText) {
        await interaction.editReply({
          embeds: [this._embeds.notCorrectChannel()],
        })

        throw new Error('Error in setting the ticket channel, wrong channel type')
      }

      const { channelId: channelID, guildId: guildID } = interaction

      // Create guild if it doesn't exist, create
      const guild = await this._apiService.guildAPIService.getGuild(guildID)

      const updateGuild = !guild
        ? await this._apiService.guildAPIService.addGuild(guildID, {
            ticketChannelID: channelID,
            supportRoleID: role.id,
          })
        : await this._apiService.guildAPIService.updateGuild(guildID, {
            ticketChannelID: channelID,
            supportRoleID: role.id,
          })

      // Artificial delay
      setTimeout(async () => {
        try {
          // Send message success by success update ticket channel and initialize ticket system
          if (!updateGuild) {
            // Send error by not success update ticket channel
            await interaction.editReply({
              embeds: [this._embeds.errorBySetTicketChannel()],
            })

            throw new Error('Error in create ticket system. Failed to add to the DB')
          }

          // Remove replay message
          await interaction.deleteReply()

          interaction.channel.send({
            embeds: [this._embeds.createTicket()],
            components: [this._components.buttonCreateTicket()],
          })

          this._logger.log('Success create ticket system')
        } catch (error) {
          this._logger.error(error)
        }
      }, 300)
    } catch (error) {
      this._logger.error(error)
    }
  }
}
