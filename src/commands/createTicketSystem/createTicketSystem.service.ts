import { API } from '@/modules/API'
import { ChannelType, ChatInputCommandInteraction, Role } from 'discord.js'
import { CreateTicketSystemComponents } from './resources/createTicketSystem.components'
import { CreateTicketSystemEmbeds } from './resources/createTicketSystem.embeds'
import { Logger } from '@nestjs/common'

export class CreateTicketSystemService {
  private _embeds = new CreateTicketSystemEmbeds()
  private _components = new CreateTicketSystemComponents()
  private _logger = new Logger(CreateTicketSystemService.name)

  async onUseCommand(interaction: ChatInputCommandInteraction, role: Role) {
    await interaction.deferReply({ ephemeral: true })

    this._logger.log('-'.repeat(30))
    this._logger.log('Start create ticket system')

    // Check on channel type
    if (interaction.channel.type !== ChannelType.GuildText) {
      this._logger.error('Error in setting the ticket channel, wrong channel type')
      await interaction.editReply({
        embeds: [this._embeds.notCorrectChannel()],
      })
      return
    }

    const { channelId: channelID, guildId: guildID } = interaction

    // Create guild if it doesn't exist, create
    const result = !(await API.guildAPIService.getGuild(guildID))
      ? await API.guildAPIService.addGuild(guildID, {
          ticketChannelID: channelID,
          supportRoleID: role.id,
        })
      : await API.guildAPIService.updateGuild(guildID, {
          ticketChannelID: channelID,
          supportRoleID: role.id,
        })

    // Artificial delay
    setTimeout(async () => {
      // Send message success by success update ticket channel and initialize ticket system
      if (result) {
        // Remove replay message
        await interaction.deleteReply()

        interaction.channel
          .send({
            embeds: [this._embeds.createTicket()],
            components: [this._components.buttonCreateTicket()],
          })
          .then(() => this._logger.log('Success create ticket system'))
          .catch(() => this._logger.error('Error in create ticket system, message send fail'))

        return
      }

      this._logger.error('Error in create ticket system. Failed to add to the DB')

      // Send error by not success update ticket channel
      await interaction.editReply({
        embeds: [this._embeds.errorBySetTicketChannel()],
      })
    }, 300)
  }
}
