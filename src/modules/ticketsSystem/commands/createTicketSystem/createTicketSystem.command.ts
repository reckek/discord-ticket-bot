import { Inject, Injectable } from '@nestjs/common'
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord'
import { CreateTicketSystemOptions } from './DTO/options'
import { CreateTicketSystemService } from './createTicketSystem.service'

@Injectable()
export class CreateTicketSystem {
  constructor(@Inject(CreateTicketSystemService) private readonly _service: CreateTicketSystemService) {}

  @SlashCommand({
    name: 'create-ticket-system',
    description: 'Create ticket system',
    defaultMemberPermissions: ['Administrator'],
    dmPermission: false,
  })
  onUseCommand(@Context() [interaction]: SlashCommandContext, @Options() { role }: CreateTicketSystemOptions) {
    this._service.onUseCommand(interaction, role)
  }
}
