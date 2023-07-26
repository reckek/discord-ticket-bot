import { Logger } from '@nestjs/common';
import { Context, ContextOf, On, Once } from 'necord';

export class AppService {
  private readonly _logger = new Logger(AppService.name);

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this._logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public onWarn(@Context() [message]: ContextOf<'warn'>) {
    this._logger.warn(message);
  }

  @On('error')
  public onError(@Context() [message]: ContextOf<'error'>) {
    this._logger.error(message);
  }
}
