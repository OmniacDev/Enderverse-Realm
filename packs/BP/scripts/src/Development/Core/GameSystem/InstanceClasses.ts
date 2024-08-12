import { Player } from '@minecraft/server'
import { LobbyEvents } from './EventClasses'
import { generateID } from '../Common/ID'

export class LobbyInstance {
  protected _status: `UNLOCKED` | `LOCKED`
  protected _players: Set<Player>
  protected _maxPlayerCount: number
  protected _events: LobbyEvents
  protected _id: string

  constructor(maxPlayerCount: number = Infinity, status: `UNLOCKED` | `LOCKED` = `UNLOCKED`) {
    this._status = status
    this._maxPlayerCount = maxPlayerCount

    this._players = new Set<Player>
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

  tryConnectPlayer(player: Player) {
    if (this._status === `UNLOCKED`) {
      if (this._players.size < this._maxPlayerCount) {
        this._players.add(player)

        player.setDynamicProperty(`currentGameID`, this._id)

        this._events.playerConnect.broadcast({ player: player })
        return true
      } else return false
    } else return false
  }

  tryDisconnectPlayer(player: Player) {
    if (this._status === `UNLOCKED`) {
      if (this._players.has(player)) {
        this._players.delete(player)

        player.setDynamicProperty(`currentGameID`, undefined)

        this._events.playerDisconnect.broadcast({ player: player })
        return true
      } else return false
    } else return false
  }


  close(disconnectPlayers: boolean = true) {
    this._status = `LOCKED`

    if (disconnectPlayers) {
      this._players.forEach(player => {
        this.tryDisconnectPlayer(player)
      })
    }
  }
}

export class BridgeInstance extends LobbyInstance {
  protected _redTeam: Set<Player> = new Set<Player>
  protected _blueTeam: Set<Player> = new Set<Player>

  get redTeam() {
    return this._redTeam
  }
  get blueTeam() {
    return this._blueTeam
  }
}
