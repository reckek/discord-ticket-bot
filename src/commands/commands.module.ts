import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateTicketSystem } from './createTicketSystem'
import { PaymentsCommand } from './payments'
import { SetWelcomeChannelCommand, SetWelcomeChannelService } from './setWelocmeChannel'

@Module({
  imports: [],
  providers: [
    // Commands
    CreateTicketSystem,
    PaymentsCommand,

    // Set welcome channel command
    SetWelcomeChannelCommand,
    SetWelcomeChannelService,

    // Services
    ConfigService,
  ],
})
export class CommandsModule {}
