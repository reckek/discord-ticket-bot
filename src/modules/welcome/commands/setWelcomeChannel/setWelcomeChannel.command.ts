import { Inject, Injectable } from '@nestjs/common'
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord'
import { SetWelcomeChannelService } from './setWelcomeChannel.service'
import { SetWelcomeChannelOptions } from './DTO/options'

@Injectable()
export class SetWelcomeChannelCommand {
  constructor(@Inject(SetWelcomeChannelService) private readonly _service: SetWelcomeChannelService) {}

  @SlashCommand({
    name: 'set-welcome-channel',
    description: 'Set the welcome channel',
    dmPermission: false,
    defaultMemberPermissions: ['Administrator'],
  })
  public onUseCommand(@Context() [interaction]: SlashCommandContext, @Options() { role }: SetWelcomeChannelOptions) {
    this._service.onUseCommand(interaction, role)
  }
}
