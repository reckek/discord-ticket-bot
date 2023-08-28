import { MemberEntity } from '@/typeORM/entity/members.entity'
import { IMemberEntity } from '@/types/DBEntity.types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'

export class MemberAPIService {
  private static _logger = new Logger(MemberAPIService.name, {
    timestamp: true,
  })

  public static async getMember(memberID: Snowflake): Promise<MemberEntity> {
    return (await MemberEntity.findOne({ relations: { feedbacks: true, tickets: true }, where: { memberID } })) ?? undefined
  }

  public static async hasMember(memberID: Snowflake): Promise<boolean> {
    return !!(await this.getMember(memberID))
  }

  public static async addMember(memberID: Snowflake, memberOptions?: Partial<MemberEntity>): Promise<MemberEntity> {
    try {
      const member = await this.getMember(memberID)
      if (member) return member

      const entity = new MemberEntity()
      entity.memberID = memberID
      entity.feedbacks = memberOptions?.feedbacks ?? []
      entity.tickets = memberOptions?.tickets ?? []

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  public static async updateMember(memberID: Snowflake, updateData: Partial<Omit<IMemberEntity, 'memberID'>>) {
    const entity = await this.getMember(memberID)

    if (!entity) return

    for (const key in updateData) {
      const entityValue = entity[key]
      const updatedValue = updateData[key]

      if (Array.isArray(updatedValue) && entityValue?.length > 0) {
        entity[key] = updatedValue.push(...updatedValue)
        return
      }

      entity[key] = updateData[key] ?? entity[key]
    }

    return await entity.save()
  }

  public static async removeMember(memberID: Snowflake): Promise<MemberEntity> {
    try {
      const entity = await this.getMember(memberID)

      return await entity.remove()
    } catch (err) {
      this._logger.error(err)
    }
  }
}
