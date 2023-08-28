import { ticketsSystemRoutes } from '@/constants/routes'
import { CommandSleepService } from '@/core/commandSleep'
import { APIService } from '@/core/API'
import { TicketStatus } from '@/types/DBEntity.types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  ChannelType,
  ThreadAutoArchiveDuration,
  ThreadChannel,
  roleMention as roleMentionString,
  userMention as userMentionString,
} from 'discord.js'
import { Button, ButtonContext, Context } from 'necord'
import { TicketsComponents } from './resources/ticketsSystem.components'
import { TicketsEmbeds } from './resources/ticketsSystem.embeds'

@Injectable()
export class TicketsSystemService {
  private _logger = new Logger(TicketsSystemService.name)
  private _embeds = new TicketsEmbeds()
  private _components = new TicketsComponents()
  private _sleep = new CommandSleepService()

  constructor(@Inject(APIService) private readonly _apiService: APIService) {}

  @Button(ticketsSystemRoutes.buttonCreate)
  public async onClickCreateTicket(@Context() [interaction]: ButtonContext) {
    try {
      this._logger.log('-'.repeat(30))
      this._logger.log('Start create ticket')

      const { channel, user: member } = interaction

      // is type guard for textChannel
      if (channel.type !== ChannelType.GuildText) return

      const guild = await this._apiService.guildAPIService.addGuild(interaction.guildId)

      if (!guild || !guild.ticketChannelID || !guild.supportRoleID) {
        interaction.reply({
          embeds: [this._embeds.errorTicketOpen()],
          ephemeral: true,
        })

        throw new Error('ticket channel not found or support role not found')
      }

      // Get all active threads of a member
      const activeThreads = (await channel.threads.fetchActive()).threads

      // Select last active thread of a member
      const lastOpenThreadOfMember = activeThreads
        .filter(thread => {
          const id = thread.name.slice(1).split(`-`)[0]
          return id === member.id
        })
        .first()

      // If member there is active thread
      if (lastOpenThreadOfMember) {
        interaction.reply({
          embeds: [this._embeds.ticketIsOpened(lastOpenThreadOfMember)],
          ephemeral: true,
        })

        throw new Error('Finally: member already have open ticket')
      }

      // Get all threads of a member
      const threadsOfMember = channel.threads.cache.filter(thread => thread.name.startsWith(`#${member.id}-`))

      // Get last thread number
      let numberLastClosedThread = 0

      threadsOfMember.forEach(thread => {
        const threadNumber = Number(thread.name.split('-')[1])
        if (threadNumber > numberLastClosedThread) numberLastClosedThread = threadNumber
      })

      // Create new private thread
      const createdThread: ThreadChannel = await channel.threads.create({
        name: `#${member.id}-${numberLastClosedThread + 1}`,
        type: ChannelType.PrivateThread,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      })

      if (!createdThread) throw new Error('Cannot create private thread', { cause: createdThread })

      this._logger.log('Private thread created', `Thread ID: ${createdThread.id}`, `Member ID: ${member.id}`)

      // Get support role id from database
      const supportRoleID = await this._apiService.guildAPIService.getSupportRole(interaction.guildId)

      // Send message to created thread
      const memberMention = userMentionString(member.id)
      const roleMention = supportRoleID ? roleMentionString(supportRoleID) : ''

      createdThread.send({
        content: `${memberMention} ${roleMention}`,
        embeds: [this._embeds.ticketSuccessCreated(member)],
        components: [this._components.generateComponentCloseTicket()],
      })

      interaction.reply({
        embeds: [this._embeds.ticketOpen(member, createdThread.id)],
        ephemeral: true,
      })

      // Create ticket in DB
      const ticket = await this._apiService.ticketsAPIService.addTicket(createdThread.id, {
        status: TicketStatus.OPEN,
        member: member.id,
      })

      if (!ticket) throw new Error('Cannot create ticket in database')
    } catch (err) {
      this._logger.error(err)
    }
  }

  @Button(ticketsSystemRoutes.buttonClose)
  public async onClickCloseTicket(@Context() [interaction]: ButtonContext) {
    try {
      await interaction.deferReply({
        ephemeral: true,
      })

      this._logger.log('-'.repeat(30))
      this._logger.log('Start close ticket')

      // Is type guard check on channel type
      if (interaction.channel.type !== ChannelType.PrivateThread) return

      const { user, member, channel: thread } = interaction

      // Get members
      const [ticket, staffRoleID] = await Promise.all([
        this._apiService.ticketsAPIService.getTicket(interaction.channel.id),
        this._apiService.guildAPIService.getSupportRole(interaction.guildId),
      ])

      const ownerID = interaction.guild.ownerId
      const memberRoles = member.roles

      // Check permission of member
      const isStaff = !Array.isArray(memberRoles) && Boolean(memberRoles.valueOf().find(role => role.id === staffRoleID))
      const isGuildOwner = user.id === ownerID
      const isMemberOpenTicket = ticket?.member?.memberID === user.id

      if (!isMemberOpenTicket && !isStaff && !isGuildOwner) {
        interaction.editReply({
          embeds: [this._embeds.errorMemberNotExistPermission()],
        })

        this._logger.log('Finally: Member do not have permission to close ticket', `Member id: ${user.id}`)

        return
      }

      thread.send({
        embeds: [this._embeds.ticketClose(user)],
      })

      await interaction.deleteReply()

      if (!thread.archived) {
        await thread.setArchived(true)

        await this._apiService.ticketsAPIService.updateTicket(thread.id, { status: TicketStatus.CLOSED })

        this._sleep.addInBlackList(interaction.user.id)
      }

      this._logger.log('Finally: Member close ticket', `Member id: ${user.id}`, `Thread ID: ${thread.id}`)
    } catch (error) {
      this._logger.error(error)
    }
  }
}
