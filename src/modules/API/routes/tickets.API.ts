import { TicketEntity } from '@/typeORM/entity/tickets.entity'
import { TicketStatus } from '@/types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'

export class TicketsAPIService {
  private _logger = new Logger(TicketsAPIService.name)

  async getTicket(threadID: Snowflake): Promise<TicketEntity> {
    return await TicketEntity.findOneBy({ threadID })
  }

  async getAllTickets(): Promise<TicketEntity[]> {
    return await TicketEntity.find()
  }

  async hasTicket(threadID: Snowflake): Promise<boolean> {
    return !!(await this.getTicket(threadID))
  }

  async addTicket(threadID: Snowflake, ticketOptions: Partial<Omit<TicketEntity, 'threadID'>>): Promise<TicketEntity> {
    try {
      const ticket = this.getTicket(threadID)
      if (ticket) return ticket

      const entity = new TicketEntity()

      entity.threadID = threadID
      entity.status = ticketOptions.status ?? TicketStatus.OPEN
      if (ticketOptions.member) entity.member = ticketOptions.member

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  async removeTicket(threadID: Snowflake): Promise<TicketEntity> {
    try {
      const entity = this.getTicket(threadID)
      await TicketEntity.delete({ threadID })
      return entity
    } catch (err) {
      this._logger.error(err)
    }
  }
}
