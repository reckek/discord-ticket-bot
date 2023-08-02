import { GuildEntity } from '@/typeORM/entity/guilds.entity'
import { IGuildEntity } from '@/types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'

export class GuildAPIService {
  private _logger = new Logger(GuildAPIService.name)

  async getGuild(guildID: Snowflake): Promise<GuildEntity> {
    try {
      return await GuildEntity.findOneBy({ guildID: guildID })
    } catch (err) {
      this._logger.error(err)
    }
  }

  async getWelcomeChannel(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.welcomeChannelID
  }

  async getTicketChannel(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.ticketChannelID
  }

  async getSupportRole(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.supportRoleID
  }

  async getFeedbackChannel(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.feedbackChannelID
  }

  async hasGuild(guildID: Snowflake): Promise<boolean> {
    try {
      return !!(await this.getGuild(guildID))
    } catch (err) {
      this._logger.error(err)
      return false
    }
  }

  async addGuild(guildID: Snowflake, guildOptions?: Partial<Omit<IGuildEntity, 'guildID'>>): Promise<GuildEntity> {
    try {
      const guildFromDB = await this.getGuild(guildID)
      if (guildFromDB) return guildFromDB

      const entity = new GuildEntity()

      entity.guildID = guildID

      for (const key in guildOptions) {
        entity[key] = guildOptions[key] ?? null
      }

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  async updateGuild(guildID: Snowflake, guild: Partial<Omit<IGuildEntity, 'guildID'>>): Promise<GuildEntity> {
    try {
      const entity = await GuildEntity.findOne({ select: ['guildID'], where: { guildID } })

      for (const key in guild) {
        entity[key] = guild[key] ?? null
      }

      return await entity.save()
    } catch (err) {
      this._logger.error(err)
    }
  }

  async removeGuild(guildID: Snowflake): Promise<GuildEntity> {
    try {
      const entity = await GuildEntity.findOne({ select: ['guildID'], where: { guildID } })

      if (entity) {
        return await entity.remove()
      }
    } catch (err) {
      this._logger.error(err)
    }
  }
}
