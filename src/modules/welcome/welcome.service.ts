import { Injectable, Logger } from '@nestjs/common'
import { ChannelType, DiscordAPIError, DiscordjsErrorCodes, GuildMember, userMention } from 'discord.js'
import { API } from '../API'
import { WelcomeEmbeds } from './resources/welcome.embeds'

@Injectable()
export class WelcomeService {
  private _logger = new Logger(WelcomeService.name)
  private _embeds = new WelcomeEmbeds()

  public async onGuildMemberAdd(member: GuildMember): Promise<void> {
    this._logger.log('-'.repeat(30))
    this._logger.log('Member join to guild', member.id)

    // Get welcome channel ID
    const welcomeChannelID = await API.guildAPIService.getWelcomeChannel(member.guild.id)
    const welcomeRoleID = await API.guildAPIService.getWelcomeRole(member.guild.id)
    const ticketChannelID = await API.guildAPIService.getTicketChannel(member.guild.id)

    // Set welcome role to member
    if (welcomeRoleID) {
      await member.roles
        .add(welcomeRoleID)
        .then(member => this._logger.log('Welcome role set to member', `Member ID: ${member.id}`, `Welcome role ID: ${welcomeRoleID}`))
        .catch(err =>
          err.code === 50001
            ? this._logger.error(`
Bot is missing access to manage roles
Member ID: ${member.id}`)
            : console.error(err),
        )
    } else {
      this._logger.error('Welcome role not found, check exist of role in db', member.id)
    }

    // If welcome channel doesn't exist
    if (!welcomeChannelID) return

    // Get member welcome channel
    const channel = await member.guild.channels.fetch(welcomeChannelID)

    if (channel === null) {
      this._logger.error(
        `
Welcome channel not found, check exist of channel.
Member ID: ${member.id}
Welcome channel ID: ${welcomeChannelID}`,
      )
      return
    }

    // Check on type of channel
    if (channel?.type !== ChannelType.GuildText) {
      this._logger.error('Welcome channel type is not text channel')
      return
    }

    // Send message in welcome channel
    channel
      .send({ content: `What's up, ${userMention(member.id)}?`, embeds: [this._embeds.onMemberAdd(ticketChannelID)] })
      .then(() => {
        this._logger.log('Welcome message send in welcome channel', `Member ID: ${member.id}`, `Welcome channel ID: ${welcomeChannelID}`)
      })
      .catch(err => this._logger.error(err))
  }
}
