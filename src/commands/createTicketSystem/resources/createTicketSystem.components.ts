import { ticketsSystemRoutes } from '@/constants'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export class CreateTicketSystemComponents {
  public buttonCreateTicket(): ActionRowBuilder<ButtonBuilder> {
    const button = new ButtonBuilder({
      customId: ticketsSystemRoutes.buttonCreate,
      label: 'Open a ticket',
      style: ButtonStyle.Success,
    })

    return new ActionRowBuilder<ButtonBuilder>({
      components: [button],
    })
  }
}
