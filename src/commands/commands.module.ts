import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateTicketSystem } from './createTicketSystem'
import { PaymentsCommand } from './payments'

@Module({
  imports: [],
  providers: [CreateTicketSystem, PaymentsCommand, ConfigService],
})
export class CommandsModule {}
