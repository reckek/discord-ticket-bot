import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Context, SlashCommand, SlashCommandContext } from 'necord'
import { PaymentsService } from './payment.service'

@Injectable()
export class PaymentsCommand {
  constructor(@Inject(ConfigService) private readonly _config: ConfigService) {}
  private _service = new PaymentsService()

  @SlashCommand({
    name: 'payments',
    description: 'Show details of payments',
  })
  async onUseCommand(@Context() [interaction]: SlashCommandContext): Promise<void> {
    this._service.onUseCommand(interaction, this._config)
  }
}
