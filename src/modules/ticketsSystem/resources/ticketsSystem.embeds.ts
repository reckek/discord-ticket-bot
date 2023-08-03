import { COLORS } from '@/constants'
import { AnyThreadChannel, EmbedBuilder, Snowflake, User } from 'discord.js'

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

  public ticketClose(): EmbedBuilder {
    return new EmbedBuilder({
      title: 'Ticket closed!',
      timestamp: new Date().getTime(),
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
      title: 'You have an unenclosed ticket!',
      color: COLORS.DANGER,
    })
  }

  public ticketIsOpened(thread: AnyThreadChannel<false>): EmbedBuilder {
    return new EmbedBuilder({
      title: 'You have an unenclosed ticket!',
      description: `Ticket: <#${thread.id}>`,
      color: COLORS.DANGER,
    })
  }
}
