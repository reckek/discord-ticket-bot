import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaymentsCommand, PaymentsService } from './payments'

@Module({
  providers: [
    // Commands
    PaymentsCommand,
    PaymentsService,

    // Services
    ConfigService,
  ],
})
export class CommandsModule {}
