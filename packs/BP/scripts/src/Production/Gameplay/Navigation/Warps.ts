import { system, world } from '@minecraft/server'
import { ActionFormData } from '@minecraft/server-ui'
import { Gamemodes } from '../Gamemodes'
import { Spawn } from './Constants'

world.beforeEvents.itemUse.subscribe(data => {
  if (data.itemStack.typeId === 'minecraft:compass') {
    const WarpsForm = new ActionFormData().title('§8WARPS').button('§8Spawn').button('§8Games').button('§8Info')
    // .button('§8KitPvP')
    // .button('§8Adventure')
    // .button('§8Arcade')
    // .button('§8Skywars')
    // .button('§8Bridge')
    // .button('§8Spleef')

    system.run(() => {
      WarpsForm.show(data.source).then(result => {
        if (!result.canceled && result.selection !== undefined) {
          switch (result.selection) {
            case 0:
              // Spawn
              data.source.tryTeleport(Spawn.location, { rotation: Spawn.rotation })
              break
            case 1:
              // Games
              data.source.tryTeleport({ x: -26.5, y: 158.0, z: -236.5 }, { rotation: { x: 0, y: 90 } })
              break
            case 2:
              // Info
              data.source.tryTeleport({ x: -35.5, y: 156.0, z: -279.5 }, { rotation: { x: 0, y: -90 } })
              break
            // case 1:
            //   // KitPvP
            //   data.source.tryTeleport(Gamemodes[0].location, { rotation: Gamemodes[0].rotation })
            //   break
            // case 2:
            //   // Adventure
            //   data.source.tryTeleport(Gamemodes[1].location, { rotation: Gamemodes[1].rotation })
            //   break
            // case 3:
            //   // Arcade
            //   data.source.tryTeleport(Gamemodes[2].location, { rotation: Gamemodes[2].rotation })
            //   break
            // case 4:
            //   // Skywars
            //   data.source.tryTeleport(Gamemodes[3].location, { rotation: Gamemodes[3].rotation })
            //   break
            // case 5:
            //   // Bridge
            //   data.source.tryTeleport(Gamemodes[4].location, { rotation: Gamemodes[4].rotation })
            //   break
            // case 6:
            //   // Spleef
            //   data.source.tryTeleport(Gamemodes[5].location, { rotation: Gamemodes[5].rotation })
            //   break
          }
        }
      })
    })
  }
})
