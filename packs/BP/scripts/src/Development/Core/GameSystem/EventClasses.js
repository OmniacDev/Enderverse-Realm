import {Player} from "@minecraft/server"

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

class PlayerConnectEventSignal {

    /** @typedef { { player: Player } } PlayerConnectEvent */

    /** @type { ((arg: PlayerConnectEvent) => void)[] } */
    #listeners = []

    /** @param { (arg: PlayerConnectEvent) => void } callback */
    subscribe(callback) {
        this.#listeners.push(callback)
        return callback
    }

    /** @param { (arg: PlayerConnectEvent) => void } callback */
    unsubscribe(callback) {
        this.#listeners.splice(this.#listeners.findIndex(data => data === callback))
    }

    /** @param { PlayerConnectEvent } arg */
    broadcast(arg) {
        this.#listeners.forEach(callback => callback(arg))
    }
}

class PlayerDisconnectEventSignal {

    /** @typedef { { player: Player } } PlayerDisconnectEvent */

    /** @type { ((arg: PlayerDisconnectEvent) => void)[] } */
    #listeners = []

    /** @param { (arg: PlayerDisconnectEvent) => void } callback */
    subscribe(callback) {
        this.#listeners.push(callback)
        return callback
    }

    /** @param { (arg: PlayerDisconnectEvent) => void } callback */
    unsubscribe(callback) {
        this.#listeners.splice(this.#listeners.findIndex(data => data === callback))
    }

    /** @param { PlayerDisconnectEvent } arg */
    broadcast(arg) {
        this.#listeners.forEach(callback => callback(arg))
    }
}