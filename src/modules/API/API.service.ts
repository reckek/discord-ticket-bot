import { FeedbackAPIService } from './routes/feedback.API'
import { GuildAPIService } from './routes/guilds.API'
import { MemberAPIService } from './routes/member.API'
import { TicketsAPIService } from './routes/tickets.API'

export const API = {
  guildAPIService: new GuildAPIService(),
  memberAPIService: new MemberAPIService(),
  ticketsAPIService: new TicketsAPIService(),
  feedbackAPIService: new FeedbackAPIService(),
}
