import { system } from '@minecraft/server'
import { BridgeInstance, LobbyInstance } from '../../Core/GameSystem/InstanceClasses'
import { sidebarTitle } from '../../Core/GUI/SidebarTitle'

export const BridgeLobby = new LobbyInstance()

system.runInterval(() => {
  if (BridgeLobby.players.size >= 1) {
    StartNewBridgeGame()
  }
})

function StartNewBridgeGame() {
  const BridgeGame = new BridgeInstance()

  BridgeLobby.players.forEach(player => {
    if (!BridgeLobby.tryDisconnectPlayer(player)) return
    BridgeGame.tryConnectPlayer(player)
  })

  if (BridgeGame.players.size >= 1) {
    for (let i = 10; i > 0; i--) {
      system.runTimeout(
        () => {
          BridgeGame.players.forEach(player => {
            let startingString =
              i > 5
                ? `§a${i}`
                : i <= 5 && i > 3
                  ? `§e${i}`
                  : i === 3
                    ? `§6${i}`
                    : i === 2
                      ? `§c${i}`
                      : i === 1
                        ? `§4${i}`
                        : `§4${i}`

            let title = sidebarTitle([
              `§l§dTHE BRIDGE §b`,
              `§72 Players Needed`,
              `§74 Players Max`,
              `§7Players §a2/2`,
              `§7Starting in: ${startingString}`,
              ``,
              `§7Level:`,
              `§7Money: §a$§a`,
              `§7Keys: §a`,
              ``,
              `§eDiscord: EqTsWvS2HB`,
              `§dRealm: QGWOhMmBmuI §a`
            ])

            if (i <= 3 && i >= 1) {
              player.playSound(`note.pling`)

              if (i === 1) {
                system.runTimeout(() => {
                  player.playSound(`random.levelup`)
                }, 20)
              }
            }

            player.onScreenDisplay.setTitle(title)
          })
        },
        200 - 20 * i
      )
    }
  }

  return BridgeGame
}
