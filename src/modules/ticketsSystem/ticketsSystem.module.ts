import { Module } from '@nestjs/common'
import { TicketsSystemService } from './ticketsSystem.service'
import { CreateTicketSystem, CreateTicketSystemService } from './commands/createTicketSystem'
import { APIService, APIModule } from '@/core/API'

@Module({
  imports: [APIModule, APIService],
  providers: [TicketsSystemService, CreateTicketSystem, CreateTicketSystemService],
})
export class TicketsSystemModule {}
