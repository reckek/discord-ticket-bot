import { ticketsSystemRoutes } from '@/constants'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export class TicketsComponents {
  public generateComponentCloseTicket(): ActionRowBuilder<ButtonBuilder> {
    const button = new ButtonBuilder({
      customId: ticketsSystemRoutes.buttonClose,
      label: 'Close ticket',
      style: ButtonStyle.Danger,
    })

    return new ActionRowBuilder<ButtonBuilder>({
      components: [button],
    })
  }
}
