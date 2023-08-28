import { CLIENT_OPTIONS } from '@/configs/client'
import { typeORMConfig } from '@/configs/typeORM'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NecordModule } from 'necord'
import { AppService } from './app.service'
import { CommandsModule } from './commands/commands.module'
import { TicketsSystemModule } from './modules/ticketsSystem'
import { WelcomeModule } from './modules/welcome'
import { APIModule } from './core/API/API.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeORMConfig,
    }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: CLIENT_OPTIONS,
    }),
    APIModule,
    CommandsModule,
    TicketsSystemModule,
    WelcomeModule,
  ],
  providers: [AppService],
})
export class AppModule {}
