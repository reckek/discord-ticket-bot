import { CLIENT_OPTIONS } from '@/configs/client'
import { typeORMConfig } from '@/configs/typeORM'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NecordModule } from 'necord'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommandsModule } from './commands/commands.module'
import { TicketsSystemModule } from './modules/ticketsSystem'
import { WelcomeModule } from './modules/welcome'

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
    CommandsModule,
    TicketsSystemModule,
    WelcomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
