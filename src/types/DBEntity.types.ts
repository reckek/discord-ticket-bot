import { FeedbackEntity } from '@/typeORM/entity/feedbacks.entity'
import { MemberEntity } from '@/typeORM/entity/members.entity'
import { TicketEntity } from '@/typeORM/entity/tickets.entity'
import { Snowflake } from 'discord.js'

export enum TicketStatus {
  OPEN = 0,
  CLOSED = 1,
}

export enum FeedbackEvaluation {
  VERY_GOOD = 5,
  GOOD = 4,
  NORMAL = 3,
  BAD = 2,
  VERY_BAD = 1,
}

export interface IGuildEntity {
  guildID: Snowflake
  supportRoleID: Snowflake | null
  welcomeChannelID: Snowflake | null
  welcomeRoleID: Snowflake | null
  ticketChannelID: Snowflake | null
  feedbackChannelID: Snowflake | null
}

export interface IMemberEntity {
  memberID: Snowflake
  feedbacks: FeedbackEntity[]
  tickets: TicketEntity[]
}

export interface IFeedbackEntity {
  feedbackID: number
  messageID: Snowflake
  message: string
  evaluation: FeedbackEvaluation
  member: MemberEntity
}

export interface ITicketEntity {
  ticketID: number
  threadID: Snowflake
  status: TicketStatus
  member: MemberEntity
}
