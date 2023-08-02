import { FeedbackEntity } from '@/typeORM/entity/feedbacks.entity'
import { GuildEntity } from '@/typeORM/entity/guilds.entity'
import { TicketEntity } from '@/typeORM/entity/tickets.entity'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { MemberEntity } from '../typeORM/entity/members.entity'

export const typeORMConfig = (ConfigService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: ConfigService.get('DB_HOST') || 'localhost',
  port: parseInt(ConfigService.get('DB_PORT'), 4) || 5432,
  database: ConfigService.get('DB_NAME') || 'postgres',
  username: ConfigService.get('DB_USERNAME') || 'postgres',
  password: ConfigService.get('DB_PASSWORD') || 'postgres',
  entities: [GuildEntity, MemberEntity, FeedbackEntity, TicketEntity],
  synchronize: true,
  retryDelay: 10000,
  logging: false,
  logger: 'advanced-console',
})
