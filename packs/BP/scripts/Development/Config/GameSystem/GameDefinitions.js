import { system } from "@minecraft/server";
import { LobbyInstance } from "../../Core/GameSystem/InstanceClasses";
import { gameManager } from "../../Core/GameSystem/ManagerClass";

// permanentGames.kitPvP.events.playerConnect.subscribe(eventData => {
//     eventData.player.tryTeleport({x: -120.5, y: 75, z: -799.5}, { rotation: {x: 0, y: -90} })
//     console.warn(`Successfully connected ${eventData.player.name} to KitPvP!`)
// })

export const bridgeLobby = new LobbyInstance()

gameManager.lobbies.push(bridgeLobby)

bridgeLobby.events.playerConnect.subscribe(eventData => {
    eventData.player.tryTeleport({x: 7534.5, y: 296, z: 8023.5}, { rotation: {x: 0, y: 90} })
    console.warn(`Connected ${eventData.player.name} to Bridge`)
})

function bridgeTitle() {

    if (bridgeLobby.players.size < 2) {
        bridgeLobby.players.forEach(player => {
            player.onScreenDisplay.setTitle([
                `§l§dTHE BRIDGE\n§r`,
                `\n§r`,
                `§7Players§8: §e${bridgeLobby.players.size}§8/§e4\n§r`,
                `\n§r`,
                `§gWaiting for players...\n§r`,
                `\n§r`,
                `§7Money: §a$3350\n§r`,
                `§7Keys: §a75\n§r`,
                `\n§r`,
                `§9Discord§8: §7EqTsWvS2HB\n§r`,
                `§uRealm§8: §7QGWOhMmBmuI`
            ])
        })
    }

    if (bridgeLobby.players.size >= 2) {
        bridgeLobby.players.forEach(player => {
            player.onScreenDisplay.setTitle([
                `§l§dTHE BRIDGE\n§r`,
                `\n§r`,
                `§7Players: §e${bridgeLobby.players.size}§7/§e4§7\n§r`,
                `\n§r`,
                `§aStarting soon...\n§r`,
                `\n§r`,
                `\n§r`,
                `§7Money: §a$3350\n§r`,
                `§7Keys: §a75\n§r`,
                `\n§r`,
                `§eDiscord: EqTsWvS2HB\n§r`,
                `§dRealm: QGWOhMmBmuI`
            ])
        })
    }
}