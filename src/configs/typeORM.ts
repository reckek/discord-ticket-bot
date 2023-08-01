import { GuildEntity } from '@/typeORM/entity/guilds.entity'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeORMConfig = (ConfigService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: ConfigService.get('DB_HOST') || 'localhost',
  port: parseInt(ConfigService.get('DB_PORT'), 4) || 5432,
  database: ConfigService.get('DB_NAME') || 'postgres',
  username: ConfigService.get('DB_USERNAME') || 'postgres',
  password: ConfigService.get('DB_PASSWORD') || 'postgres',
  entities: [GuildEntity],
  synchronize: true,
  retryDelay: 10000,
  logging: false,
  logger: 'advanced-console',
})
