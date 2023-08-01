import { Injectable, Logger } from '@nestjs/common'
import { ChannelType, GuildMember, userMention } from 'discord.js'
import { API } from '../API'
import { WelcomeEmbeds } from './resources/welcome.embeds'

@Injectable()
export class WelcomeService {
  private _logger = new Logger(WelcomeService.name)
  private _embeds = new WelcomeEmbeds()

  public async onGuildMemberAdd(member: GuildMember): Promise<void> {
    // Get welcome channel ID
    const welcomeChannelID = await API.guildAPIService.getWelcomeChannel(member.guild.id)

    // If welcome channel doesn't exist
    if (!welcomeChannelID) return

    // Get member welcome channel
    const channel = await member.guild.channels.fetch(welcomeChannelID)

    // Check on type of channel
    if (channel?.type !== ChannelType.GuildText) {
      return
    }

    // Send message in welcome channel
    channel.send({ content: `What's up, ${userMention(member.id)}?`, embeds: [this._embeds.onMemberAdd()] })
  }
}
