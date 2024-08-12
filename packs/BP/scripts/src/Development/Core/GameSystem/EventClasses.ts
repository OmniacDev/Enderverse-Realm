import { Player } from '@minecraft/server'

export class LobbyEvents {
  playerConnect = new PlayerConnectEventSignal()
  playerDisconnect = new PlayerDisconnectEventSignal()
}

/**
 * Template for EventSignal classes. Does not contain any arguments
 */
// class EventSignal {
//     /** @type { (() => void)[] } */
//     #listeners = []
//
//     /** @param { () => void } callback */
//     subscribe(callback) {
//         this.#listeners.push(callback)
//         return callback
//     }
//
//     /** @param { () => void } callback */
//     unsubscribe(callback) {
//         this.#listeners.splice(this.#listeners.findIndex(data => data == callback))
//     }
//
//     broadcast() {
//         this.#listeners.forEach(callback => callback())
//     }
// }

type PlayerConnectEvent = { player: Player }

class PlayerConnectEventSignal {
  #listeners: ((arg: PlayerConnectEvent) => void)[] = []

  subscribe(callback: (arg: PlayerConnectEvent) => void) {
    this.#listeners.push(callback)
    return callback
  }

  unsubscribe(callback: (arg: PlayerConnectEvent) => void) {
    this.#listeners.splice(this.#listeners.findIndex(data => data === callback))
  }

  broadcast(arg:  PlayerConnectEvent) {
    this.#listeners.forEach(callback => callback(arg))
  }
}

type PlayerDisconnectEvent = { player: Player }

class PlayerDisconnectEventSignal {
  #listeners: ((arg: PlayerDisconnectEvent) => void)[] = []

  subscribe(callback: (arg: PlayerDisconnectEvent) => void) {
    this.#listeners.push(callback)
    return callback
  }

  unsubscribe(callback: (arg: PlayerDisconnectEvent) => void) {
    this.#listeners.splice(this.#listeners.findIndex(data => data === callback))
  }

  broadcast(arg: PlayerDisconnectEvent) {
    this.#listeners.forEach(callback => callback(arg))
  }
}
