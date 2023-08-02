import { ITicketEntity, TicketStatus } from '@/types'
import { Snowflake } from 'discord.js'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { MemberEntity } from './members.entity'

@Entity()
export class TicketEntity extends BaseEntity implements ITicketEntity {
  @PrimaryGeneratedColumn()
  ticketID: number

  @PrimaryColumn({ type: 'text' })
  threadID: Snowflake

  @Column({ type: 'int2' })
  status: TicketStatus

  @ManyToOne(() => MemberEntity, member => member.tickets)
  member: MemberEntity
}
