import { Role } from 'discord.js'
import { RoleOption } from 'necord'

export class CreateTicketSystemOptions {
  @RoleOption({
    name: 'role',
    description: 'Select the role that will be pinged when the ticket create.',
    required: true,
  })
  role: Role
}
