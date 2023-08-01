import { IGuildEntity } from '@/types'
import { Snowflake } from 'discord.js'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class GuildEntity extends BaseEntity implements IGuildEntity {
  @PrimaryColumn({ type: 'text', unique: true })
  guildID: Snowflake

  @Column({ type: 'text', unique: true, nullable: true })
  ticketChannelID: Snowflake

  @Column({ type: 'text', unique: true, nullable: true })
  welcomeChannelID: Snowflake

  @Column({ type: 'text', unique: true, nullable: true })
  supportRoleID: Snowflake
}
