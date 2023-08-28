import type { FeedbackEvaluation, IFeedbackEntity } from '@/types/DBEntity.types'
import { Snowflake } from 'discord.js'
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { MemberEntity } from './members.entity'

@Entity()
export class FeedbackEntity extends BaseEntity implements IFeedbackEntity {
  @Index()
  @PrimaryGeneratedColumn()
  feedbackID: number

  @Column({ type: 'text', nullable: true })
  messageID: Snowflake

  @Column({ type: 'text' })
  message: string

  @Column({ type: 'smallint' })
  evaluation: FeedbackEvaluation

  @ManyToOne(() => MemberEntity, member => member.feedbacks)
  member: MemberEntity
}
