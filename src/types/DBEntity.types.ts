import { Snowflake } from 'discord.js'

export interface IGuildEntity {
  guildID: Snowflake
  supportRoleID: Snowflake | null
  welcomeChannelID: Snowflake | null
  ticketChannelID: Snowflake | null
}

export interface IMemberEntity {
  memberID: Snowflake
  feedbacks: Snowflake[]
  tickets: Snowflake[]
}

export interface IFeedbackEntity {
  feedbackID: number
  messageID: Snowflake
  message: string
  evaluation: number
}

export interface ITicketEntity {
  ticketID: number
  threadID: Snowflake
  member: Snowflake
}
