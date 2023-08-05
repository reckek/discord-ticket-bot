import { ticketsSystemRoutes } from '@/constants'
import { CommandSleepService } from '@/core/commandSleep'
import { API } from '@/modules/API'
import { TicketStatus } from '@/types'
import { Injectable, Logger } from '@nestjs/common'
import { ChannelType, ThreadAutoArchiveDuration, roleMention, userMention } from 'discord.js'
import { Button, ButtonContext, Context } from 'necord'
import { TicketsComponents } from './resources/ticketsSystem.components'
import { TicketsEmbeds } from './resources/ticketsSystem.embeds'

@Injectable()
export class TicketsSystemService {
  private _logger = new Logger(TicketsSystemService.name)
  private _embeds = new TicketsEmbeds()
  private _components = new TicketsComponents()
  private _sleep = new CommandSleepService()

  @Button(ticketsSystemRoutes.buttonCreate)
  public async onClickCreateTicket(@Context() [interaction]: ButtonContext) {
    try {
      const channel = await interaction.channel.fetch()

      // is type textChannel
      if (!channel.isTextBased() || !('threads' in channel) || channel.type !== ChannelType.GuildText) {
        return
      }

      const guildFromDB = await API.guildAPIService.addGuild(interaction.guildId)

      if (!guildFromDB || !guildFromDB.ticketChannelID || !guildFromDB.supportRoleID) {
        this._logger.error('Guild not found or ticket channel not found or support role not found')
        interaction.reply({
          embeds: [this._embeds.errorTicketOpen()],
          ephemeral: true,
        })
        return
      }

      const { threads } = channel

      const member = interaction.user

      // Get all active threads of a member
      const activeThreads = (await threads.fetchActive()).threads

      // Select last active thread of a member
      const lastOpenMemberThread = activeThreads
        .filter(thread => {
          const id = thread.name.slice(1).split(`-`)[0]
          return id === member.id
        })
        .first()

      // If member there is active thread
      if (lastOpenMemberThread) {
        interaction.reply({
          embeds: [this._embeds.ticketIsOpened(lastOpenMemberThread)],
          ephemeral: true,
        })

        return
      }

      // Get all threads of a member
      const threadsByMember = threads.cache.filter(thread => thread.name.startsWith(`#${member.id}-`))

      // Get last thread number
      let lastThreadNumber = 0

      threadsByMember.forEach(thread => {
        const threadNumber = Number(thread.name.split('-')[1])
        if (threadNumber > lastThreadNumber) lastThreadNumber = threadNumber
      })

      // Create new private thread
      const createdThread = await channel.threads.create({
        name: `#${member.id}-${lastThreadNumber + 1}`,
        type: ChannelType.PrivateThread,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      })

      // Get support role id from database
      const getRoleID = await API.guildAPIService.getSupportRole(interaction.guildId)

      // Send message to created thread
      const _memberMention = userMention(member.id)
      const _roleMention = getRoleID ? roleMention(getRoleID) : ''

      createdThread.send({
        content: `${_memberMention} ${_roleMention}`,
        embeds: [this._embeds.ticketSuccessCreated(member)],
        components: [this._components.generateComponentCloseTicket()],
      })

      interaction.reply({
        embeds: [this._embeds.ticketOpen(member, createdThread.id)],
        ephemeral: true,
      })

      const ticket = await API.ticketsAPIService.addTicket(createdThread.id, {
        status: TicketStatus.OPEN,
        member: member.id,
      })

      if (!ticket) {
        this._logger.error('Cannot create ticket and add in database')
      }
    } catch (err) {
      this._logger.error(err)
    }
  }

  @Button(ticketsSystemRoutes.buttonClose)
  public async onClickCloseTicket(@Context() [interaction]: ButtonContext) {
    try {
      if (interaction.channel.type !== ChannelType.PrivateThread) return

      const ticket = await API.ticketsAPIService.getTicket(interaction.channel.id)
      const staffRoleID = await API.guildAPIService.getSupportRole(interaction.guildId)
      const memberRoles = interaction.member.roles

      const isMemberOpenedTicket = ticket?.member?.memberID === interaction.user.id
      const isStaff = !Array.isArray(memberRoles) && Boolean(memberRoles.valueOf().find(role => role.id === staffRoleID))
      const isGuildOwner = interaction.user.id === interaction.guild.ownerId

      if (!isMemberOpenedTicket && !isStaff && !isGuildOwner) {
        interaction.reply({
          embeds: [this._embeds.errorMemberNotExistPermission()],
          ephemeral: true,
        })
        return
      }

      await interaction.deferReply({
        ephemeral: true,
      })

      interaction.channel.send({
        embeds: [this._embeds.ticketClose()],
      })

      await interaction.deleteReply()

      await interaction.channel.setArchived(true)

      await API.ticketsAPIService.updateTicket(interaction.channel.id, { status: TicketStatus.CLOSED })

      this._sleep.addInBlackList(interaction.user.id)
    } catch (error) {
      this._logger.error(error)
    }
  }
}
