import { Module } from '@nestjs/common'
import { WelcomeListeners } from './welcome.listeners'
import { WelcomeService } from './welcome.service'
import { SetWelcomeChannelCommand, SetWelcomeChannelService } from './commands/setWelcomeChannel'
import { APIModule, APIService } from '@/core/API'

@Module({
  imports: [APIModule, APIService],
  providers: [WelcomeListeners, WelcomeService, SetWelcomeChannelCommand, SetWelcomeChannelService],
})
export class WelcomeModule {}
