import { BlockPermutation, system, world } from '@minecraft/server'

const updating: string[] = []

const CropTypes = ['minecraft:wheat', 'minecraft:beetroot', 'minecraft:carrots', 'minecraft:potatoes']

const init_delay = 20 // 20s delay before the crop starts regrowing (400 Ticks)
const stage_delay = 60 // 3s delay between stages of growth (60 Ticks)

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
  const data = eventData

  if (
    CropTypes.includes(data.block.typeId) &&
    data.dimension.getBlock({ x: data.block.location.x, y: data.block.location.y - 2, z: data.block.location.z })
      ?.typeId === 'minecraft:green_concrete'
  ) {
    const location_str = `${data.block.location.x}, ${data.block.location.y}, ${data.block.location.z}`
    const typeId = data.block.typeId

    let state = 0

    let delay = init_delay
    let update = false

    if (data.block.permutation.getState('growth') === 7) {
      update = true
    } else if ((data.block.permutation.getState('growth') as number) < 7) {
      eventData.cancel = true

      if (updating.includes(location_str)) {
        update = false
      } else {
        state = data.block.permutation.getState('growth') as number
        delay = stage_delay
        update = true
      }
    }

    if (update) {
      let currentState = state

      system.runTimeout(() => {
        updating.push(location_str)

        for (let i = currentState; i < 7; i++) {
          const permutation = BlockPermutation.resolve(typeId, { growth: i + 1 })

          system.runTimeout(
            () => {
              currentState++

              data.dimension.getBlock(data.block.location)?.setPermutation(permutation)

              if (currentState >= 7) {
                updating.splice(updating.indexOf(location_str))
              }
            },
            stage_delay * (i - state)
          )
        }
      }, delay)
    }
  }
})
