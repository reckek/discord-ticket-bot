import { Module } from '@nestjs/common'
import { WelcomeListeners } from './welcome.listeners'
import { WelcomeService } from './welcome.service'

@Module({
  providers: [WelcomeListeners, WelcomeService],
})
export class WelcomeModule {}
