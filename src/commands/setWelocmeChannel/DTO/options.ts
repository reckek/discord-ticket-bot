import { Role } from 'discord.js'
import { RoleOption } from 'necord'

export class SetWelcomeChannelOptions {
  @RoleOption({
    name: 'role',
    description: 'The role to set by default on join the guild.',
    required: true,
  })
  role: Role
}
