import { TicketEntity } from '@/typeORM/entity/tickets.entity'
import { ITicketEntity, TicketStatus } from '@/types/DBEntity.types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'
import { MemberAPIService } from './member.API'

export class TicketsAPIService {
  private static _logger = new Logger(TicketsAPIService.name)

  public static async getTicket(threadID: Snowflake): Promise<TicketEntity> {
    return await TicketEntity.findOne({ relations: { member: true }, where: { threadID } })
  }

  public static async getAllTickets(): Promise<TicketEntity[]> {
    return await TicketEntity.find()
  }

  public static async hasTicket(threadID: Snowflake): Promise<boolean> {
    return !!(await this.getTicket(threadID))
  }

  public static async addTicket(threadID: Snowflake, ticketOptions: { status: TicketStatus; member: Snowflake }): Promise<TicketEntity> {
    try {
      const ticket = await this.getTicket(threadID)
      if (ticket) return ticket

      const entity = new TicketEntity()

      entity.threadID = threadID
      entity.status = ticketOptions.status ?? TicketStatus.OPEN

      const member = await MemberAPIService.addMember(ticketOptions.member)
      entity.member = member

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  public static async updateTicket(
    threadID: Snowflake,
    ticketOptions: Partial<Pick<ITicketEntity, 'member' | 'status'>>,
  ): Promise<TicketEntity> {
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

  public static async removeTicket(threadID: Snowflake): Promise<TicketEntity> {
    try {
      const entity = this.getTicket(threadID)
      await TicketEntity.delete({ threadID })
      return entity
    } catch (err) {
      this._logger.error(err)
    }
  }
}
