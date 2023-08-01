import { Inject, Injectable } from '@nestjs/common'
import { Context, ContextOf, On } from 'necord'
import { WelcomeService } from './welcome.service'

@Injectable()
export class WelcomeListeners {
  constructor(@Inject(WelcomeService) private readonly _welcomeService: WelcomeService) {}

  @On('guildMemberAdd')
  onMemberJoin(@Context() [member]: ContextOf<'guildMemberAdd'>) {
    this._welcomeService.onGuildMemberAdd(member)
  }
}
