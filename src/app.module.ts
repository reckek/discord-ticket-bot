import { CLIENT_OPTIONS } from '@/configs/client'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NecordModule } from 'necord'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: CLIENT_OPTIONS,
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
