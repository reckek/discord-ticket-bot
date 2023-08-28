import { Inject, Injectable, Logger } from '@nestjs/common'
import { ChannelType, DiscordAPIError, DiscordjsErrorCodes, GuildMember, userMention } from 'discord.js'
import { APIService } from '@/core/API'
import { WelcomeEmbeds } from './resources/welcome.embeds'

@Injectable()
export class WelcomeService {
  private _logger = new Logger(WelcomeService.name)
  private _embeds = new WelcomeEmbeds()

  constructor(@Inject(APIService) private readonly _apiService: APIService) {}

  public async onGuildMemberAdd(member: GuildMember): Promise<void> {
    this._logger.log('-'.repeat(30))
    this._logger.log('Member join to guild', member.id)

    try {
      // Get welcome channel ID
      const [welcomeChannelID, welcomeRoleID, ticketChannelID] = await Promise.all([
        this._apiService.guildAPIService.getWelcomeChannel(member.guild.id),
        this._apiService.guildAPIService.getWelcomeRole(member.guild.id),
        this._apiService.guildAPIService.getTicketChannel(member.guild.id),
      ])

      // Check welcome channel ID
      if (!welcomeRoleID) throw new Error(`Welcome role not found, check exist of role in db. Member ID: ${member.id}`)

      const updatedMember = await member.roles.add(welcomeRoleID)
      this._logger.log('Welcome role set to member', `Member ID: ${updatedMember.id}`, `Welcome role ID: ${welcomeRoleID}`)

      // Get member welcome channel
      const channel = await member.guild.channels.fetch(welcomeChannelID)

      if (channel === null) {
        throw new Error(
          `Welcome channel not found, check exist of channel.\nMember ID: ${member.id}\nWelcome channel ID: ${welcomeChannelID}`,
        )
      }

      // Check on type of channel
      if (channel?.type !== ChannelType.GuildText) throw new Error('Welcome channel type is not text channel')

      // Send message in welcome channel
      channel.send({ content: `What's up, ${userMention(member.id)}?`, embeds: [this._embeds.onMemberAdd(ticketChannelID)] })

      this._logger.log('Welcome message send in welcome channel', `Member ID: ${member.id}`, `Welcome channel ID: ${welcomeChannelID}`)
    } catch (error) {
      if (error.code !== 50001) {
        this._logger.error(error)
        return
      }

      this._logger.error(`
Bot is missing access to manage roles
Member ID: ${member.id}
`)
    }
  }
}
