import { world } from '@minecraft/server'

import { GetPlayerRole } from '../Roles/roles'

// const defaultCommandPrefix = `!`
// const defaultChatRole = `§bMember`

// world.afterEvents.worldInitialize.subscribe(() => {
//     if (world.getDynamicProperty(`commands.prefix`) == undefined) {
//         world.setDynamicProperty(`commands.prefix`, defaultCommandPrefix);
//     }
// })

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

  // const commandPrefix = world.getDynamicProperty(`commands.prefix`)

  // if (!originalMessage.startsWith(commandPrefix)) {

  // }

  // else if (originalMessage.startsWith(commandPrefix)) {
  //     if (originalMessage.startsWith(`${commandPrefix}prefix`)) {
  //         let commandArgs = originalMessage.split(` `)
  //         if (commandArgs[1] != undefined && commandArgs[1] != ``) {
  //             if (commandArgs[1] == `/`) {
  //                 data.sender.sendMessage(`§cUnable to set the command prefix to §7${commandArgs[1]}§r`)
  //             }
  //             else {
  //                 world.setDynamicProperty(`commands.prefix`, commandArgs[1])
  //                 data.sender.sendMessage(`§aSet the command prefix to §7${commandArgs[1]}§r`)
  //             }
  //         }
  //     }
  //     else if (originalMessage.startsWith(`${commandPrefix}role`)) {
  //         let commandArgs = originalMessage.split(` `)
  //         if (commandArgs[1] != undefined && commandArgs[1] != ``) {
  //             data.sender.setDynamicProperty(`chat.role`, commandArgs[1])
  //             data.sender.sendMessage(`§aSet your chat role to §7${commandArgs[1]}§r`)
  //         }
  //     }
  //     else {
  //         if (originalMessage == commandPrefix) {
  //             data.sender.sendMessage(`§c[!] Please enter a valid command. Use §e${commandPrefix}help§c to see a list of available commands.`)
  //         }
  //         else {
  //             data.sender.sendMessage(`§c[!] Could not find command §7${originalMessage}§c. Please use §e${commandPrefix}help§c to see a list of available commands.`)
  //         }
  //     }
  // }
})
