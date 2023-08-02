import { Inject, Injectable } from '@nestjs/common'
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord'
import { FeedbackOptions } from './DTO/options.DTO'
import { FeedbackService } from './feedback.service'

@Injectable()
export class FeedbackCommand {
  constructor(@Inject(FeedbackService) private readonly _service: FeedbackService) {}

  @SlashCommand({
    name: 'feedback',
    description: 'Feedback about support work',
  })
  async onUseCommand(@Context() [interaction]: SlashCommandContext, @Options() { evaluation, message }: FeedbackOptions) {
    this._service.onUseCommand(interaction, { evaluation, message })
  }
}
