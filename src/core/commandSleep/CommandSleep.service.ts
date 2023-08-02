import { Snowflake } from 'discord.js'

interface IOptionsForCreateStore {
  /**
   * Time to live in seconds.
   * @default 1h - 1 hour or 3600 seconds.
   */
  ttl?: number
}

const storeOptionsByDefault: IOptionsForCreateStore = {
  ttl: 300000,
}

export const timeToMilliseconds = 1000

/**
 * Black list members add on command.
 * Member cannot use the command for a certain amount of time.
 */
export class CommandSleepService {
  private _storeMembers = new Set<Snowflake>()
  private _timeOutIDs = new Map<
    Snowflake,
    {
      timeoutID: NodeJS.Timeout
      ttl: number
    }
  >()

  isMemberInBlackList(memberID: Snowflake): boolean {
    return this._storeMembers.has(memberID)
  }

  /**
   * Add member in black list.
   *
   * @param memberID
   * @param [options]
   * @returns in black list
   */
  addInBlackList(memberID: Snowflake, options?: IOptionsForCreateStore): Snowflake {
    const _options = options ? { ...storeOptionsByDefault, ...options } : storeOptionsByDefault

    this._storeMembers.add(memberID)
    this._setTimeout(memberID, _options.ttl)

    return memberID
  }

  /**
   * Remove member from black list.
   *
   * @param memberID
   * @returns from black list
   */
  removeFromBlackList(memberID: Snowflake): Snowflake {
    this._storeMembers.delete(memberID)
    this._removeTimeout(memberID)

    return memberID
  }

  /**
   * Method of running a report before removing a user from the blacklist.
   *
   * @private
   * @param memberID - member id.
   * @param ttl - time to live in seconds.
   */
  private _setTimeout(memberID: Snowflake, ttl: number): void {
    this._timeOutIDs.set(memberID, {
      timeoutID: setTimeout(() => {
        if (this._storeMembers.has(memberID)) {
          // this.removeSession(memberID)
        }
      }, ttl * timeToMilliseconds),
      ttl,
    })
  }

  /**
   * Method remove member from black list by end of time.
   *
   * @private
   * @param memberID - id сессии.
   * @returns timeout
   */
  private _removeTimeout(memberID: string): void {
    if (!this._timeOutIDs.has(memberID)) {
      return
    }

    clearTimeout(this._timeOutIDs.get(memberID).timeoutID)
    this._timeOutIDs.delete(memberID)
  }
}
