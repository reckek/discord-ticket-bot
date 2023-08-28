import { FeedbackEntity } from '@/typeORM/entity/feedbacks.entity'
import { MemberEntity } from '@/typeORM/entity/members.entity'
import { FeedbackEvaluation, IFeedbackEntity } from '@/types/DBEntity.types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'
import { MemberAPIService } from './member.API'

export class FeedbackAPIService {
  private static _logger = new Logger(FeedbackAPIService.name)

  public static async getFeedback(feedbackID: number): Promise<FeedbackEntity> {
    return await FeedbackEntity.findOneBy({ feedbackID })
  }

  public static async getAllMemberFeedbacks(memberID: Snowflake): Promise<FeedbackEntity[]> {
    const memberAndConnectedFeedbacks = await MemberEntity.findOne({
      relations: {
        feedbacks: true,
      },
      where: {
        memberID,
      },
    })

    return memberAndConnectedFeedbacks.feedbacks
  }

  public static async getFeedbacks(): Promise<FeedbackEntity[]> {
    return await FeedbackEntity.find()
  }

  public static async addFeedback(
    memberID: Snowflake,
    feedback: Partial<Pick<FeedbackEntity, 'message' | 'evaluation'>>,
  ): Promise<FeedbackEntity> {
    try {
      const memberEntity = await MemberAPIService.addMember(memberID)

      const entity = new FeedbackEntity()

      entity.message = feedback.message ?? ''
      entity.evaluation = feedback.evaluation ?? FeedbackEvaluation.NORMAL
      entity.member = memberEntity

      await entity.save()

      await MemberAPIService.updateMember(memberID, { feedbacks: [entity] })

      return entity
    } catch (err) {
      this._logger.error(err)
    }
  }

  public static async updateFeedback(
    feedbackID: number,
    updateData: Partial<Omit<IFeedbackEntity, 'feedbackID'>>,
  ): Promise<FeedbackEntity> {
    const entity = await FeedbackEntity.findOneBy({ feedbackID })

    entity.evaluation = updateData.evaluation ?? entity.evaluation
    entity.message = updateData.message ?? entity.message
    entity.member = updateData.member ?? entity.member
    entity.messageID = updateData.messageID ?? entity.messageID

    return await entity.save()
  }

  public static async removeFeedback(feedbackID: number): Promise<FeedbackEntity> {
    return (await FeedbackEntity.findOneBy({ feedbackID }))?.remove()
  }
}
