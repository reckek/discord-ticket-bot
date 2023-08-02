import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateTicketSystem } from './createTicketSystem'
import { FeedbackCommand } from './feedback/feedback.command'
import { FeedbackService } from './feedback/feedback.service'
import { PaymentsCommand } from './payments'
import { SetFeedbackChannelCommand, SetFeedbackChannelService } from './setChannelFeedback'
import { SetWelcomeChannelCommand, SetWelcomeChannelService } from './setWelocmeChannel'

@Module({
  imports: [],
  providers: [
    // Commands
    CreateTicketSystem,
    PaymentsCommand,

    // Feedback (command)
    FeedbackCommand,
    FeedbackService,

    // Set welcome channel (command)
    SetWelcomeChannelCommand,
    SetWelcomeChannelService,

    // Set feedback channel (command)
    SetFeedbackChannelCommand,
    SetFeedbackChannelService,

    // Services
    ConfigService,
  ],
})
export class CommandsModule {}
