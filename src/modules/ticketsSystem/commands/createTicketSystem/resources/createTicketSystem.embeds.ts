import { COLORS } from '@/constants/colors'
import { EmbedBuilder } from 'discord.js'

export class CreateTicketSystemEmbeds {
  public notCorrectChannel(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Wrong channel type, please use command in text channel.',
      color: COLORS.ERROR,
    })
  }

  public createTicket(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Create a ticket',
      description: `
> Hey, want to order a design?
> Then open a ticket and we'll answer it in a jiffy!
> Dear customer, before opening a ticket

> I strongly recommend that you familiarize yourself with the prices of the basic interfaces - <#1045159151875149954>
      `,
      image: {
        url: 'https://media.discordapp.net/attachments/1056253634108723282/1098245454489190522/Frame_389.png',
      },
      color: COLORS.INFO,
    })
  }

  public ticketSystemSuccessCreated(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Success',
      description: 'Ticket system created successfully.',
      color: COLORS.SUCCESS,
    })
  }

  public errorBySetTicketChannel(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Error',
      description: 'Error in setting the ticket channel.',
      color: COLORS.ERROR,
    })
  }
}
