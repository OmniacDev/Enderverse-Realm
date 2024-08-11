import { world, Player} from "@minecraft/server"

const commandManager = new CustomCommandManager()

commandManager.commands.push(RoleCommand)

const commandIdentifiers = commandManager.commands.map(data => { return data.identifier })

class CustomCommandManager {
    /** @type { CustomCommand[] } */
    commands
}

class CustomCommand {

    /** @typedef { { message: string, sender: Player } } CustomCommandArgs */

    /** @type { ((arg: CustomCommandArgs) => void)[] } */
    #listeners = []

    /** @type { string } */
    identifier;

    /** @param { string } identifier */
    constructor(identifier) {
        this.identifier = identifier
    }

    /** @param { (arg: CustomCommandArgs) => void } callback */
    subscribe(callback) {
        this.#listeners.push(callback)
        return callback
    }

    /** @param { (arg: CustomCommandArgs) => void } callback */
    unsubscribe(callback) {
        this.#listeners.splice(this.#listeners.findIndex(data => data == callback))
    }

    /** @param { CustomCommandArgs } arg */
    broadcast(arg) {
        this.#listeners.forEach(callback => callback(arg))
    }
}

const RoleCommand = new CustomCommand(`role`)

RoleCommand.subscribe()
RoleCommand.unsubscribe()
RoleCommand.broadcast()

RoleCommand.identifier