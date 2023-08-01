import { Inject, Injectable } from '@nestjs/common'
import { Context, SlashCommand, SlashCommandContext } from 'necord'
import { SetWelcomeChannelService } from './setWelcomeChannel.service'

@Injectable()
export class SetWelcomeChannelCommand {
  constructor(@Inject(SetWelcomeChannelService) private readonly _service: SetWelcomeChannelService) {}

  @SlashCommand({
    name: 'set-welcome-channel',
    description: 'Set the welcome channel',
    dmPermission: false,
    defaultMemberPermissions: ['Administrator'],
  })
  public onUseCommand(@Context() [interaction]: SlashCommandContext) {
    this._service.onUseCommand(interaction)
  }
}
