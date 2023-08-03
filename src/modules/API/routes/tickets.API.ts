import { TicketEntity } from '@/typeORM/entity/tickets.entity'
import { ITicketEntity, TicketStatus } from '@/types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'
import { API } from '../API.service'

export class TicketsAPIService {
  private _logger = new Logger(TicketsAPIService.name)

  async getTicket(threadID: Snowflake): Promise<TicketEntity> {
    return await TicketEntity.findOne({ relations: { member: true }, where: { threadID } })
  }

  async getAllTickets(): Promise<TicketEntity[]> {
    return await TicketEntity.find()
  }

  async hasTicket(threadID: Snowflake): Promise<boolean> {
    return !!(await this.getTicket(threadID))
  }

  async addTicket(threadID: Snowflake, ticketOptions: { status: TicketStatus; member: Snowflake }): Promise<TicketEntity> {
    try {
      const ticket = await this.getTicket(threadID)
      if (ticket) return ticket

      const entity = new TicketEntity()

      entity.threadID = threadID
      entity.status = ticketOptions.status ?? TicketStatus.OPEN

      const member = await API.memberAPIService.getMember(ticketOptions.member)
      entity.member = member

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  async updateTicket(threadID: Snowflake, ticketOptions: Partial<Pick<ITicketEntity, 'member' | 'status'>>): Promise<TicketEntity> {
    try {
      const entity = await this.getTicket(threadID)
      if (!entity) return

      for (const key in ticketOptions) {
        entity[key] = ticketOptions[key] ?? entity[key]
      }

      entity.save()
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
