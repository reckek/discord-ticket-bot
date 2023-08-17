import { COLORS } from '@/constants'
import { AnyThreadChannel, EmbedBuilder, Snowflake, User, userMention } from 'discord.js'

export class TicketsEmbeds {
  public ticketOpen(member: User, ticketChannelID: Snowflake): EmbedBuilder {
    return new EmbedBuilder({
      title: `${member.username} opened a ticket`,
      description: `You successfully opened a ticket. Your ticket: <#${ticketChannelID}>`,
      color: COLORS.SUCCESS,
    })
  }

  public ticketSuccessCreated(member: User): EmbedBuilder {
    return new EmbedBuilder({
      title: `${member.username[0].toUpperCase() + member.username.slice(1)} created a ticket`,
      description: `You successfully created a ticket. We will be with you soon.`,
      footer: {
        text: 'You can close ticket by clicking the button below.',
      },
      color: COLORS.SUCCESS,
    })
  }

  public ticketClose(member: User): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Ticket closed!',
      timestamp: new Date().getTime(),
      description: `Ticket close: ${userMention(member.id)}`,
      color: COLORS.INFO,
    })
  }

  public privateCloseTicket(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'We have success closed your ticket!',
      color: COLORS.INFO,
    })
  }

  public errorMemberNotExistPermission(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'You do not have sufficient rights to close the ticket!',
      color: COLORS.DANGER,
    })
  }

  public ticketIsOpened(thread: AnyThreadChannel<false>): EmbedBuilder {
    return new EmbedBuilder({
      title: 'You already have 1 open ticket!',
      description: `Ticket: <#${thread.id}>`,
      color: COLORS.DANGER,
    })
  }

  public errorTicketOpen(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'We apologize, we were unable to open the tike!',
      color: COLORS.DANGER,
    })
  }
}
