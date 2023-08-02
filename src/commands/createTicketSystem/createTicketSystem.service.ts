import { API } from '@/modules/API'
import { ChannelType, ChatInputCommandInteraction, Role } from 'discord.js'
import { CreateTicketSystemComponents } from './resources/createTicketSystem.components'
import { CreateTicketSystemEmbeds } from './resources/createTicketSystem.embeds'

export class CreateTicketSystemService {
  private _embeds = new CreateTicketSystemEmbeds()
  private _components = new CreateTicketSystemComponents()

  async onUseCommand(interaction: ChatInputCommandInteraction, role: Role) {
    await interaction.deferReply({ ephemeral: true })

    // Check on channel type
    if (interaction.channel.type !== ChannelType.GuildText) {
      await interaction.editReply({
        embeds: [this._embeds.notCorrectChannel()],
      })

      return
    }

    const { channelId: channelID, guildId: guildID } = interaction

    // Update setting bot in database
    const res = await API.guildAPIService.updateGuild(guildID, {
      ticketChannelID: channelID,
      supportRoleID: role.id,
    })

    setTimeout(async () => {
      // Send message success by success update ticket channel and initialize ticket system
      if (res) {
        // Remove replay message
        await interaction.deleteReply()

        await interaction.channel.send({
          embeds: [this._embeds.createTicket()],
          components: [this._components.buttonCreateTicket()],
        })
        return
      }

      // Send error by not success update ticket channel
      await interaction.editReply({
        embeds: [this._embeds.errorBySetTicketChannel()],
      })
    }, 300)
  }
}
