import { FeedbackEntity } from '@/typeORM/entity/feedbacks.entity'
import { MemberEntity } from '@/typeORM/entity/members.entity'
import { FeedbackEvaluation, IFeedbackEntity } from '@/types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'
import { API } from '../API.service'

export class FeedbackAPIService {
  private _logger = new Logger(FeedbackAPIService.name)

  async getFeedback(feedbackID: number): Promise<FeedbackEntity> {
    return await FeedbackEntity.findOneBy({ feedbackID })
  }

  async getAllMemberFeedbacks(memberID: Snowflake): Promise<FeedbackEntity[]> {
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

  async getFeedbacks(): Promise<FeedbackEntity[]> {
    return await FeedbackEntity.find()
  }

  async addFeedback(memberID: Snowflake, feedback: Partial<Pick<FeedbackEntity, 'message' | 'evaluation'>>): Promise<FeedbackEntity> {
    try {
      const memberEntity = await API.memberAPIService.addMember(memberID)

      const entity = new FeedbackEntity()

      entity.message = feedback.message ?? ''
      entity.evaluation = feedback.evaluation ?? FeedbackEvaluation.NORMAL
      entity.member = memberEntity

      await entity.save()

      await API.memberAPIService.updateMember(memberID, { feedbacks: [entity] })

      return entity
    } catch (err) {
      this._logger.error(err)
    }
  }

  async updateFeedback(feedbackID: number, updateData: Partial<Omit<IFeedbackEntity, 'feedbackID'>>): Promise<FeedbackEntity> {
    const entity = await FeedbackEntity.findOneBy({ feedbackID })

    entity.evaluation = updateData.evaluation ?? entity.evaluation
    entity.message = updateData.message ?? entity.message
    entity.member = updateData.member ?? entity.member
    entity.messageID = updateData.messageID ?? entity.messageID

    return await entity.save()
  }

  async removeFeedback(feedbackID: number): Promise<FeedbackEntity> {
    return (await FeedbackEntity.findOneBy({ feedbackID }))?.remove()
  }
}
