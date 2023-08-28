import { FeedbackAPIService } from './routes/feedback.API'
import { GuildAPIService } from './routes/guilds.API'
import { MemberAPIService } from './routes/member.API'
import { TicketsAPIService } from './routes/tickets.API'

export class APIService {
  public guildAPIService = GuildAPIService
  public memberAPIService = MemberAPIService
  public ticketsAPIService = TicketsAPIService
  public feedbackAPIService = FeedbackAPIService
}
