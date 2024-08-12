import { BlockPermutation, system, world } from '@minecraft/server'

const updating: string[] = []

const OreTypes = [
  'minecraft:coal_ore',
  'minecraft:iron_ore',
  'minecraft:copper_ore',
  'minecraft:gold_ore',
  'minecraft:diamond_ore'
]

const stages = ['minecraft:cobblestone', 'minecraft:andesite', 'minecraft:stone']

const init_delay = 1 // 20s delay before the crop starts regrowing (400 Ticks)
const stage_delay = 60 // 3s delay between stages of growth (60 Ticks)

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
  const data = eventData

  if (
    OreTypes.includes(data.block.typeId) &&
    data.dimension.getBlock({ x: data.block.location.x, y: data.block.location.y - 2, z: data.block.location.z })?.typeId === 'minecraft:orange_concrete'
  ) {
    const location_string = `${data.block.location.x}, ${data.block.location.y}, ${data.block.location.z}`

    let init_state = 0

    let delay = init_delay
    let update = true

    let temp_stages = stages
    temp_stages.push(data.block.typeId)

    if (update) {
      let state = init_state

      system.runTimeout(() => {
        updating.push(location_string)

        for (let i = state; i < temp_stages.length; i++) {
          const permutation = BlockPermutation.resolve(temp_stages[i])

          system.runTimeout(
            () => {
              state++

              data.dimension.getBlock(data.block.location)?.setPermutation(permutation)

              if (state >= temp_stages.length) {
                updating.splice(updating.indexOf(location_string))
              }
            },
            stage_delay * (i - init_state)
          )
        }
      }, delay)
    }
  }
})
