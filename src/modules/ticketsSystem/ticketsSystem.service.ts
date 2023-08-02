import { ticketsSystemRoutes } from '@/constants'
import { CommandSleepService } from '@/core/commandSleep'
import { Injectable } from '@nestjs/common'
import { ChannelType, ThreadAutoArchiveDuration, roleMention, userMention } from 'discord.js'
import { Button, ButtonContext, Context } from 'necord'
import { API } from '../API'
import { TicketsComponents } from './resources/ticketsSystem.components'
import { TicketsEmbeds } from './resources/ticketsSystem.embeds'

@Injectable()
export class TicketsSystemService {
  private _embeds = new TicketsEmbeds()
  private _components = new TicketsComponents()
  private _sleep = new CommandSleepService()

  @Button(ticketsSystemRoutes.buttonCreate)
  public async onClickCreateTicket(@Context() [interaction]: ButtonContext) {
    const channel = await interaction.channel.fetch()

    // is type textChannel
    if (!channel.isTextBased() || !('threads' in channel) || channel.type !== ChannelType.GuildText) {
      return
    }

    const { threads } = channel

    const member = interaction.user

    // Get all active threads of a member
    const [memberActiveThread] = (await threads.fetchActive()).members.filter(m => m.id === m.id)

    // If member there is active thread
    if (memberActiveThread) {
      const [memberID, memberThread] = memberActiveThread

      interaction.reply({
        embeds: [this._embeds.ticketIsOpened(memberThread.thread)],
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
  }

  @Button(ticketsSystemRoutes.buttonClose)
  public async onClickCloseTicket(@Context() [interaction]: ButtonContext) {
    if (interaction.channel.type !== ChannelType.PrivateThread) return

    await interaction.deferReply({
      ephemeral: true,
    })

    interaction.channel.send({
      embeds: [this._embeds.ticketClose()],
    })

    await interaction.deleteReply()

    await interaction.channel.setArchived(true)

    this._sleep.addInBlackList(interaction.user.id)
  }
}
