import { world, system, BlockPermutation } from "@minecraft/server"

let currentlyUpdatingBlocks = []

const cropTypes = [
    "minecraft:wheat",
    "minecraft:beetroot",
    "minecraft:carrots",
    "minecraft:potatoes"
]

const regrowDelay = 20; // 20-Second delay before the crop starts regrowing (400 Ticks)
const stageGrowthDelay = 60; // 3-Second delay between stages of growth (60 Ticks)

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
    const data = eventData;

    if(cropTypes.includes(data.block.typeId) && (data.dimension.getBlock({x: data.block.location.x, y: data.block.location.y - 2, z: data.block.location.z}).typeId === "minecraft:green_concrete"))
    {
        const blockLocationString = `${data.block.location.x}, ${data.block.location.y}, ${data.block.location.z}`
        const blockNameString = data.block.typeId

        let initialState = 0

        let currentGrowDelay = regrowDelay
        let updateCrop = false

        if(data.block.permutation.getState('growth') === 7)  {
            updateCrop = true
        }
        
        else if (data.block.permutation.getState('growth') < 7) {

            eventData.cancel = true

            if(currentlyUpdatingBlocks.includes(blockLocationString)) {
                updateCrop = false
            }

            else {
                initialState = data.block.permutation.getState('growth')
                currentGrowDelay = stageGrowthDelay
                updateCrop = true
            }

        }
        
        if(updateCrop) {

            let currentState = initialState

            system.runTimeout(() => {

                currentlyUpdatingBlocks.push(blockLocationString)
                
                for (let i = currentState; i < 7; i++) {

                    const permutation = BlockPermutation.resolve(blockNameString, { growth: i + 1 })
        
                    system.runTimeout(() => {
                        currentState++

                        data.dimension.getBlock(data.block.location).setPermutation(permutation)

                        if (currentState >= 7) {
                            currentlyUpdatingBlocks.splice(currentlyUpdatingBlocks.indexOf(blockLocationString))
                        }

                    }, stageGrowthDelay * (i - initialState));

                }

            }, currentGrowDelay)

        }

    }

})