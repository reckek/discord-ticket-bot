import { FeedbackEntity } from '@/typeORM/entity/feedbacks.entity'
import { MemberEntity } from '@/typeORM/entity/members.entity'
import { TicketEntity } from '@/typeORM/entity/tickets.entity'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'

export class MemberAPIService {
  private _logger = new Logger(MemberAPIService.name)

  async getMember(memberID: Snowflake): Promise<MemberEntity> {
    return await MemberEntity.findOneBy({ memberID })
  }

  async hasMember(memberID: Snowflake): Promise<boolean> {
    return !!(await this.getMember(memberID))
  }

  async addMember(memberID: Snowflake, memberOptions?: { tickets?: TicketEntity[]; feedbacks?: FeedbackEntity[] }): Promise<MemberEntity> {
    try {
      const member = this.getMember(memberID)
      if (member) return member

      const entity = new MemberEntity()

      entity.memberID = memberID
      entity.feedbacks = memberOptions.feedbacks ?? []
      entity.tickets = memberOptions.tickets ?? []

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  async removeMember(memberID: Snowflake): Promise<MemberEntity> {
    try {
      const entity = await MemberEntity.findOneBy({ memberID })

      return await entity.remove()
    } catch (err) {
      this._logger.error(err)
    }
  }
}
