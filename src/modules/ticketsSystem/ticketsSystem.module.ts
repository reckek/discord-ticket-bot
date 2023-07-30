import { Module } from '@nestjs/common'
import { TicketsSystemService } from './ticketsSystem.service'

@Module({
  providers: [TicketsSystemService],
})
export class TicketsSystemModule {}
