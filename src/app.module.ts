import { CLIENT_OPTIONS } from '@/configs/client'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NecordModule } from 'necord'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CommandsModule } from './commands/commands.module'
import { TicketsSystemModule } from './modules/ticketsSystem'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: typeORMConfig,
    // }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: CLIENT_OPTIONS,
    }),
    CommandsModule,
    TicketsSystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
