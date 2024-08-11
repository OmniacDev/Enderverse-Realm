import { PlayerInteractWithEntityBeforeEvent, Player, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

import { bridgeLobby } from "./Config/GameSystem/GameDefinitions";
import { BridgeLobby } from "./Games/Bridge/BridgeLobby";
import { gameManager } from "./Core/GameSystem/ManagerClass";

const slapperGamemodes = [
    "none",
    "kitpvp",
    "adventure",
    "arcade",
    "skywars",
    "bridge"
]

const slapperUI = [ 
    new ActionFormData()
        .title('§8Slapper Settings')
        .button('§sEdit Slapper§r')
        .button('§cDelete Slapper§r')
    ,
    new ActionFormData()
        .title(`§8Slapper Settings`)
        .button(`§bSet Up Slapper`)
        .button(`§cDelete Slapper`)
]

world.beforeEvents.playerInteractWithEntity.subscribe(eventData => {
    SlapperBeforeEvent(eventData)
})

/** @param { PlayerInteractWithEntityBeforeEvent } eventData*/
function SlapperBeforeEvent(eventData) {
    if (eventData.target.hasTag(`slapper`)) {

        if (eventData.player.isOp() && eventData.itemStack?.typeId == "minecraft:lodestone_compass" && eventData.player.isSneaking) {
            eventData.cancel = true
    
            if (eventData.target.getDynamicProperty(`slapperGamemode`) == undefined) {
                system.run(() => {
                    slapperUI[1]
                        .show(eventData.player)
                        .then(responseData => {
                            switch (responseData.selection) {
                                case 0:
                                    new ModalFormData()
                                        .title('§8Slapper Settings | §bSet Up Slapper')
                                        .dropdown(`Select this slapper's gamemode`, slapperGamemodes, 0)
                                        .textField(`Set this slapper's name`, `Slapper`)
                                        .show(eventData.player)
                                        .then(responseData => {
                                            if (!responseData.canceled) {
                                                eventData.target.setDynamicProperty(`slapperGamemode`, slapperGamemodes[responseData.formValues[0]])
                                                eventData.target.nameTag = responseData.formValues[1]
                                            }
                                        })
                                    break
                                case 1:
                                    new MessageFormData()
                                        .title(`§8Slapper Settings | §cDelete Slapper`)
                                        .body(`Are you sure you want to delete this slapper?`)
                                        .button1(`No`)
                                        .button2(`Yes`)
                                        .show(eventData.player)
                                        .then(responseData => {
                                            if (!responseData.canceled) {
                                                if (responseData.selection == 1) eventData.target.remove()
                                            }   
                                        })
                                    break
                            }
                        })
                })
            }
    
            else {
                system.run(() => {
                    slapperUI[0]
                        .show(eventData.player)
                        .then(responseData => {
                            switch (responseData.selection) {
                                case 0:
                                    new ModalFormData()
                                        .title('§8Slapper Settings | §sEdit Slapper')
                                        .dropdown(`Select this slapper's gamemode`, slapperGamemodes, slapperGamemodes.indexOf(eventData.target.getDynamicProperty(`slapperGamemode`)))
                                        .textField(`Set this slapper's name`, eventData.target.nameTag, eventData.target.nameTag)
                                        .show(eventData.player)
                                        .then(responseData => {
                                            if (!responseData.canceled) {
                                                eventData.target.setDynamicProperty(`slapperGamemode`, slapperGamemodes[responseData.formValues[0]])
                                                eventData.target.nameTag = responseData.formValues[1]
                                            }
                                        })
                                    break
                                case 1:
                                    new MessageFormData()
                                        .title(`§8Slapper Settings | §cDelete Slapper`)
                                        .body(`Are you sure you want to delete this slapper?`)
                                        .button1(`No`)
                                        .button2(`Yes`)
                                        .show(eventData.player)
                                        .then(responseData => {
                                            if (!responseData.canceled) {
                                                if (responseData.selection == 1) eventData.target.remove()
                                            }
                                        })
                                    break
                            }
                        })
                })
            }
        }

        else {
            eventData.cancel = true

            system.run(() => {
                switch (eventData.target.getDynamicProperty(`slapperGamemode`)) {
                    case undefined:
                        break
                    case `none`:
                        break
                    case `kitpvp`:
                        KitPVP_Teleport(eventData.player)
                        break
                    case `adventure`:
                        Adventure_Teleport(eventData.player)
                        break
                    case `arcade`:
                        Arcade_Teleport(eventData.player)
                        break
                    case `skywars`:
                        Skywars_Teleport(eventData.player)
                        break
                    case `bridge` :
                        Bridge_Teleport(eventData.player)
                        break
                    default: 
                        break
                }
            })
        }
    }
}

world.afterEvents.entityHitEntity.subscribe(eventData => {
    if (eventData.damagingEntity.typeId == "minecraft:player" && eventData.hitEntity.hasTag('slapper')) {

        switch (eventData.hitEntity.getDynamicProperty(`slapperGamemode`)) {
            case undefined:
                break
            case `none`:
                break
            case `kitpvp`:
                KitPVP_Teleport(eventData.damagingEntity)
                break
            case `adventure`:
                Adventure_Teleport(eventData.damagingEntity)
                break
            case `arcade`:
                Arcade_Teleport(eventData.damagingEntity)
                break
            case `skywars`:
                Skywars_Teleport(eventData.damagingEntity)
                break
            case `bridge` :
                Bridge_Teleport(eventData.damagingEntity)
                break
            default: 
                break
        }
    }
})

/** @param { Player } player */
function KitPVP_Teleport(player) {
    // console.warn(`Connected to KitPvP: ${permanentGames.kitPvP.tryConnectPlayer(player)}`)
}

/** @param { Player } player */
function Adventure_Teleport(player) {
    player.tryTeleport({x: 963.5, y: 84, z: 855.5}, { rotation: {x: 0, y: 0} })
}

/** @param { Player } player */
function Arcade_Teleport(player) {
    player.tryTeleport({x: 7018.5, y: 110, z: 7025.5}, { rotation: {x: 0, y: 180} })
}

/** @param { Player } player */
function Skywars_Teleport(player) {
    player.tryTeleport({x: -4995.5, y: 296, z: -4989.5}, { rotation: {x: 0, y: 90} })
}

/** @param { Player } player */
function Bridge_Teleport(player) {
    BridgeLobby.tryConnectPlayer(player)
}

system.afterEvents.scriptEventReceive.subscribe(eventData => {
    if (eventData.id == "ec:leaveGame") {
        if (eventData.sourceEntity) {
            const entity = eventData.sourceEntity?.typeId == "minecraft:npc" ? eventData.initiator : eventData.sourceEntity
            if (entity.typeId == "minecraft:player") {
                const gameID = entity.getDynamicProperty(`currentGameID`)

                if (gameID) {
                    console.warn(gameManager.lobbies.find(data => data.id == gameID)?.tryDisconnectPlayer(entity))
                }
            }
        }
    }
})

