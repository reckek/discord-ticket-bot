import { GuildEntity } from '@/typeORM/entity/guilds.entity'
import { IGuildEntity } from '@/types/DBEntity.types'
import { Logger } from '@nestjs/common'
import { Snowflake } from 'discord.js'

export class GuildAPIService {
  private static _logger = new Logger(GuildAPIService.name)

  public static async getGuild(guildID: Snowflake): Promise<GuildEntity> {
    try {
      return await GuildEntity.findOneBy({ guildID: guildID })
    } catch (err) {
      this._logger.error(err)
    }
  }

  public static async getWelcomeChannel(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.welcomeChannelID
  }

  public static async getWelcomeRole(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.welcomeRoleID
  }

  public static async getTicketChannel(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.ticketChannelID
  }

  public static async getSupportRole(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.supportRoleID
  }

  public static async getFeedbackChannel(guildID: Snowflake): Promise<Snowflake> {
    return (await this.getGuild(guildID))?.feedbackChannelID
  }

  public static async hasGuild(guildID: Snowflake): Promise<boolean> {
    try {
      return !!(await this.getGuild(guildID))
    } catch (err) {
      this._logger.error(err)
      return false
    }
  }

  public static async addGuild(guildID: Snowflake, guildOptions?: Partial<Omit<IGuildEntity, 'guildID'>>): Promise<GuildEntity> {
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

  public static async updateGuild(guildID: Snowflake, guild: Partial<Omit<IGuildEntity, 'guildID'>>): Promise<GuildEntity> {
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

  public static async removeGuild(guildID: Snowflake): Promise<GuildEntity> {
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
