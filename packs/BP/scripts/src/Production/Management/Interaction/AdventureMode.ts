import { GameMode, world } from '@minecraft/server'

const disabled_tools = [
  'minecraft:netherite_hoe',
  'minecraft:diamond_hoe',
  'minecraft:iron_hoe',
  'minecraft:golden_hoe',
  'minecraft:stone_hoe',
  'minecraft:wooden_hoe',
  'minecraft:netherite_axe',
  'minecraft:diamond_axe',
  'minecraft:iron_axe',
  'minecraft:golden_axe',
  'minecraft:stone_axe',
  'minecraft:wooden_axe',
  'minecraft:netherite_shovel',
  'minecraft:diamond_shovel',
  'minecraft:iron_shovel',
  'minecraft:golden_shovel',
  'minecraft:stone_shovel',
  'minecraft:wooden_shovel'
]

world.beforeEvents.itemUseOn.subscribe(event => {
  if (event.source.getGameMode() === GameMode.adventure) {
    if (disabled_tools.includes(event.itemStack.typeId)) {
      event.cancel = true
    }
  }
})
