import { Player } from '@minecraft/server'
import { LobbyEvents } from './EventClasses'
import { generateID } from '../Common/ID'

export class LobbyInstance {
  /** @type { `UNLOCKED` | `LOCKED`} @protected */ _status
  /** @type { Set<Player> } @protected */ _players
  /** @type { number } @protected */ _maxPlayerCount
  /** @type { LobbyEvents } @protected */ _events
  /** @type { string } @protected */ _id

  /**
   * @param { number } maxPlayerCount
   * @param { `UNLOCKED` | `LOCKED`} status
   */
  constructor(maxPlayerCount = Infinity, status = `UNLOCKED`) {
    this._status = status
    this._maxPlayerCount = maxPlayerCount

    this._players = new Set()
    this._events = new LobbyEvents()
    this._id = generateID()
  }

  get status() {
    return this._status
  }
  get players() {
    return this._players
  }
  get maxPlayerCount() {
    return this._maxPlayerCount
  }
  get events() {
    return this._events
  }
  get id() {
    return this._id
  }

  /** @param { Player } player */
  tryConnectPlayer(player) {
    if (this._status === `UNLOCKED`) {
      if (this._players.size < this._maxPlayerCount) {
        this._players.add(player)

        player.setDynamicProperty(`currentGameID`, this._id)

        this._events.playerConnect.broadcast({ player: player })
        return true
      } else return false
    } else return false
  }

  /** @param { Player } player */
  tryDisconnectPlayer(player) {
    if (this._status === `UNLOCKED`) {
      if (this._players.has(player)) {
        this._players.delete(player)

        player.setDynamicProperty(`currentGameID`, undefined)

        this._events.playerDisconnect.broadcast({ player: player })
        return true
      } else return false
    } else return false
  }

  /** @param { boolean } disconnectPlayers */
  close(disconnectPlayers = true) {
    this._status = `LOCKED`

    if (disconnectPlayers) {
      this._players.forEach(player => {
        this.tryDisconnectPlayer(player)
      })
    }
  }
}

export class BridgeInstance extends LobbyInstance {
  /** @protected @type { Set<Player> } */ _redTeam
  /** @protected @type { Set<Player> } */ _blueTeam

  get redTeam() {
    return this._redTeam
  }
  get blueTeam() {
    return this._blueTeam
  }
}
