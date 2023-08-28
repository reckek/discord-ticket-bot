import { IMemberEntity } from '@/types/DBEntity.types'
import { Snowflake } from 'discord.js'
import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { FeedbackEntity } from './feedbacks.entity'
import { TicketEntity } from './tickets.entity'

@Entity()
export class MemberEntity extends BaseEntity implements IMemberEntity {
  @PrimaryColumn({ type: 'text', unique: true })
  memberID: Snowflake

  @OneToMany(() => FeedbackEntity, feedback => feedback.member)
  feedbacks: FeedbackEntity[]

  @OneToMany(() => TicketEntity, ticket => ticket.member)
  tickets: TicketEntity[]
}
