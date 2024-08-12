import { world } from '@minecraft/server'

const defaultCommandPrefix = `!`
const defaultChatRole = `§bMember`

world.afterEvents.worldInitialize.subscribe(() => {
  if (world.getDynamicProperty(`commandPrefix`) === undefined) {
    world.setDynamicProperty(`commandPrefix`, defaultCommandPrefix)
  }
})

world.afterEvents.playerSpawn.subscribe(afterEventData => {
  if (afterEventData.initialSpawn) {
    if (afterEventData.player.getDynamicProperty(`chatRole`) === undefined) {
      afterEventData.player.setDynamicProperty(`chatRole`, defaultChatRole)
    }

    world.sendMessage(`§g[!]§7 Welcome §e@${afterEventData.player.name}§7 to the §dEnderverse §uRealm§7!`)
  }
})

world.beforeEvents.chatSend.subscribe(beforeEventData => {
  beforeEventData.cancel = true

  const originalMessage = beforeEventData.message

  const commandPrefix = world.getDynamicProperty(`commandPrefix`) as string

  if (originalMessage.startsWith(commandPrefix)) {
    if (originalMessage.startsWith(`${commandPrefix}prefix `)) {
      let commandArgs = originalMessage.split(` `)
      if (commandArgs[1] !== undefined) {
        world.setDynamicProperty(`commandPrefix`, commandArgs[1])
        beforeEventData.sender.sendMessage(`§aSet the command prefix to §7${commandArgs[1]}§r`)
      }
    } else if (originalMessage.startsWith(`${commandPrefix}role`)) {
      let commandArgs = originalMessage.split(` `)
      if (commandArgs[1] !== undefined) {
        beforeEventData.sender.setDynamicProperty(`chatRole`, commandArgs[1])
        beforeEventData.sender.sendMessage(`§aSet your chat role to §7${commandArgs[1]}§r`)
      }
    } else {
      if (originalMessage === commandPrefix) {
        beforeEventData.sender.sendMessage(
          `§c[!] Please enter a valid command. Use §e${commandPrefix}help§c to see a list of available commands.`
        )
      } else {
        beforeEventData.sender.sendMessage(
          `§c[!] Could not find command §7${originalMessage}§c. Please use §e${commandPrefix}help§c to see a list of available commands.`
        )
      }
    }
  } else {
    if (beforeEventData.targets !== undefined) {
      beforeEventData.targets.forEach(target => {
        target.sendMessage(
          `§8[§7${beforeEventData.sender.getDynamicProperty(`chatRole`)}§8] §7${beforeEventData.sender.name} §8»§7 ${originalMessage}`
        )
      })
    } else {
      world.sendMessage(
        `§8[§7${beforeEventData.sender.getDynamicProperty(`chatRole`)}§8] §7${beforeEventData.sender.name} §8»§7 ${originalMessage}`
      )
    }
  }
})
