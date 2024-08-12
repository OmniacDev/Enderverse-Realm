import { world } from '@minecraft/server'
import { GetPlayerRole } from './Roles'

world.afterEvents.playerSpawn.subscribe(data => {
  if (data.initialSpawn) {
    world.sendMessage(`§g[!]§7 Welcome §e@${data.player.name}§7 to the §dEnderverse §uRealm§7!`)
  }
})

world.beforeEvents.chatSend.subscribe(data => {
  data.cancel = true

  if (data.targets !== undefined) {
    data.targets.forEach(target => {
      target.sendMessage(`§8[§r§7${GetPlayerRole(data.sender)}§r§8] §7${data.sender.name} §8»§7 ${data.message}`)
    })
  } else {
    world.sendMessage(`§8[§r§7${GetPlayerRole(data.sender)}§r§8] §7${data.sender.name} §8»§7 ${data.message}`)
  }
})
