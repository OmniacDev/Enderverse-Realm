import { world } from '@minecraft/server'

world.beforeEvents.playerInteractWithBlock.subscribe(eventData => {
  eventData.cancel = !eventData.player.hasTag('canInteract')
})

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
  eventData.cancel = !eventData.player.hasTag('canBreak')
})

// world.beforeEvents.playerInteractWithEntity.subscribe(eventData => {
//     if (eventData.target.typeId == `minecraft:armor_stand`) {
//         eventData.cancel = true
//     }
// })

// world.beforeEvents.itemUse.subscribe(eventData => {
//     if (eventData.itemStack.typeId == `minecraft:fishing_rod`) {
//         eventData.cancel = true
//     }
// })
