import { ChannelType, ChatInputCommandInteraction, Role } from 'discord.js'
import { CreateTicketSystemComponents } from './resources/createTicketSystem.components'
import { CreateTicketSystemEmbeds } from './resources/createTicketSystem.embeds'

export class CreateTicketSystemService {
  private _embeds = new CreateTicketSystemEmbeds()
  private _components = new CreateTicketSystemComponents()

  async onUseCommand(interaction: ChatInputCommandInteraction, role: Role) {
    await interaction.deferReply({ ephemeral: true })

    if (interaction.channel.type !== ChannelType.GuildText) {
      await interaction.editReply({
        embeds: [this._embeds.notCorrectChannel()],
      })

      return
    }

    // interaction.channel.

    setTimeout(async () => {
      await interaction.deleteReply()

      await interaction.channel.send({
        embeds: [this._embeds.createTicket()],
        components: [this._components.buttonCreateTicket()],
      })
    }, 300)
  }
}
