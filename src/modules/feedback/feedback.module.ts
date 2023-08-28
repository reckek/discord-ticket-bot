import { Module } from '@nestjs/common'
import { SetWelcomeChannelService } from '../welcome/commands/setWelcomeChannel'
import { FeedbackCommand } from './commands/feedback'

@Module({
  providers: [FeedbackCommand, SetWelcomeChannelService, SetWelcomeChannelService],
})
export class FeedbackModule {}
