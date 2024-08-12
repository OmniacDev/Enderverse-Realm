import { Entity, Player, system, world } from '@minecraft/server'
import { MessageFormData, ModalFormData } from '@minecraft/server-ui'

const config = {
  edit_item: 'ec:slapper_config',

  gamemodes: [
    {
      display_name: 'KitPvP',
      id: 'kitpvp',
      location: { x: -120.5, y: 75, z: -799.5 },
      rotation: { x: 0, y: -90 }
    },
    {
      display_name: 'Adventure',
      id: 'adventure',
      location: { x: 963.5, y: 84, z: 855.5 },
      rotation: { x: 0, y: 0 }
    },
    {
      display_name: 'Arcade',
      id: 'arcade',
      location: { x: 7018.5, y: 110, z: 7025.5 },
      rotation: { x: 0, y: 180 }
    },
    {
      display_name: 'Skywars',
      id: 'skywars',
      location: { x: -4995.5, y: 296, z: -4989.5 },
      rotation: { x: 0, y: 90 }
    },
    {
      display_name: 'Bridge',
      id: 'bridge',
      location: { x: 7534.5, y: 296, z: 8023.5 },
      rotation: { x: 0, y: 90 }
    },
    {
      display_name: 'Spleef',
      id: 'spleef',
      location: { x: 825.5, y: 118, z: -370.5 },
      rotation: { x: 0, y: 0 }
    }
  ],

  properties: {
    is_slapper: 'slapper.is_slapper',
    gamemode_id: 'slapper.gamemode_id'
  }
}

world.beforeEvents.playerInteractWithEntity.subscribe(data => {
  if (data.target.typeId === 'minecraft:npc') {
    const is_slapper = data.target.getDynamicProperty(config.properties.is_slapper) !== undefined

    const args = { player: data.player, slapper: data.target }

    if (data.itemStack?.typeId === config.edit_item && data.player.hasTag('staff')) {
      data.cancel = true

      system.run(() => {
        if (is_slapper) EditSlapper(args)
        else CreateSlapper(args)
      })
    } else if (is_slapper) {
      data.cancel = true

      system.run(() => {
        RunSlapper(args)
      })
    }
  }
})

world.afterEvents.entityHitEntity.subscribe(data => {
  if (
    data.damagingEntity.typeId === 'minecraft:player' &&
    data.hitEntity.typeId === 'minecraft:npc' &&
    (data.hitEntity.getDynamicProperty(config.properties.is_slapper) ?? false)
  ) {
    const args = { player: data.damagingEntity as Player, slapper: data.hitEntity }

    RunSlapper(args)
  }
})

function EditSlapper(arg: { player: Player; slapper: Entity }) {
  const gamemode_names = config.gamemodes.map(entry => {
    return entry.display_name
  })
  const selected_gamemode_index = config.gamemodes.findIndex(entry => {
    return entry.id === arg.slapper.getDynamicProperty(config.properties.gamemode_id)
  })

  const EditForm = new ModalFormData()
    .title('§8EDIT SLAPPER')
    .dropdown('GAMEMODE', gamemode_names, selected_gamemode_index)
    .toggle('§cDEACTIVATE?', false)

  EditForm.show(arg.player).then(response => {
    if (!response.canceled) {
      if (response.formValues) {
        if (response.formValues[1]) DeactivateSlapper(arg)
        else {
          const gamemode_index = response.formValues[0] as number
          const gamemode_id = config.gamemodes[gamemode_index].id

          arg.slapper.setDynamicProperty(config.properties.gamemode_id, gamemode_id)
        }
      }
    }
  })
}

function DeactivateSlapper(arg: { player: Player; slapper: Entity }) {
  const DeactivateConfirmationForm = new MessageFormData()
    .title('§cDEACTIVATE SLAPPER')
    .body(
      'Are you sure you want to §c deactivate §r this slapper? (This will remove all settings and return the slapper to its default NPC state)'
    )
    .button1('NO')
    .button2('YES')

  DeactivateConfirmationForm.show(arg.player).then(response => {
    if (!response.canceled) {
      if (response.selection === 1) {
        arg.slapper.setDynamicProperty(config.properties.is_slapper, undefined)
        arg.slapper.setDynamicProperty(config.properties.gamemode_id, undefined)
      }
    }
  })
}

function CreateSlapper(arg: { player: Player; slapper: Entity }) {
  const CreateForm = new MessageFormData()
    .title('§8CREATE SLAPPER')
    .body('Create new slapper?')
    .button1('NO')
    .button2('YES')

  CreateForm.show(arg.player).then(response => {
    if (!response.canceled) {
      if (response.selection === 1) {
        arg.slapper.setDynamicProperty(config.properties.is_slapper, true)
        EditSlapper(arg)
      }
    }
  })
}

function RunSlapper(arg: { player: Player; slapper: Entity }) {
  const gamemode_id: string = arg.slapper.getDynamicProperty(config.properties.gamemode_id) as string

  if (gamemode_id !== undefined) {
    const gamemode = config.gamemodes.find(entry => {
      return entry.id === gamemode_id
    })

    if (gamemode !== undefined) {
      arg.player.tryTeleport(gamemode.location, { rotation: gamemode.rotation })
    }
  }
}
