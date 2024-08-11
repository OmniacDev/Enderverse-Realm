import {BlockPermutation, system, world} from "@minecraft/server"

var currentlyUpdatingBlocks = []

const oreTypes = [
    "minecraft:coal_ore",
    "minecraft:iron_ore",
    "minecraft:copper_ore",
    "minecraft:gold_ore",
    "minecraft:diamond_ore"
]

const regenStages = [
    "minecraft:cobblestone",
    "minecraft:andesite",
    "minecraft:stone",
]

const regenDelay = 1; // 20 Second delay before the crop starts regrowing (400 Ticks)
const stageRegenDelay = 60; // 3 Second delay between stages of growth (60 Ticks)

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
    const data = eventData;

    if(oreTypes.includes(data.block.typeId) && (data.dimension.getBlock({x: data.block.location.x, y: data.block.location.y - 2, z: data.block.location.z}).typeId === "minecraft:orange_concrete"))
    {
        const blockLocationString = `${data.block.location.x}, ${data.block.location.y}, ${data.block.location.z}`

        let initialState = 0

        let currentRegenDelay = regenDelay
        let updateOre = true

        let tempRegenStages = regenStages
        tempRegenStages.push(data.block.typeId)
        
        if(updateOre) {

            let currentState = initialState

            system.runTimeout(() => {

                currentlyUpdatingBlocks.push(blockLocationString)
                
                for (let i = currentState; i < tempRegenStages.length; i++) {

                    const permutation = BlockPermutation.resolve(tempRegenStages[i])
        
                    system.runTimeout(() => {
                        currentState++

                        data.dimension.getBlock(data.block.location).setPermutation(permutation)

                        if (currentState >= tempRegenStages.length) {
                            currentlyUpdatingBlocks.splice(currentlyUpdatingBlocks.indexOf(blockLocationString))
                        }

                    }, stageRegenDelay * (i - initialState));

                }

            }, currentRegenDelay)

        }

    }

})