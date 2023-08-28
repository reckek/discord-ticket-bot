import { Inject, Injectable } from '@nestjs/common'
import { Context, SlashCommand, SlashCommandContext } from 'necord'
import { SetFeedbackChannelService } from './setChannelFeedback.service'

@Injectable()
export class SetFeedbackChannelCommand {
  constructor(@Inject(SetFeedbackChannelService) private readonly _service: SetFeedbackChannelService) {}

  @SlashCommand({
    name: 'set-feedback-channel',
    description: 'Set the feedback channel',
    dmPermission: false,
    defaultMemberPermissions: ['Administrator'],
  })
  onUseCommand(@Context() [interaction]: SlashCommandContext) {
    this._service.onUseCommand(interaction)
  }
}
