import { Entity, Player, system, world } from '@minecraft/server'
import { MessageFormData, ModalFormData } from '@minecraft/server-ui'

import { slapper_config as config } from '../Config/config'

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
    const args = { player: data.damagingEntity, slapper: data.hitEntity }

    RunSlapper(args)
  }
})

/** @param { { player: Player, slapper: Entity} } arg */
function EditSlapper(arg) {
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
      if (response.formValues[1]) DeactivateSlapper(arg)
      else {
        /** @type { number } */
        const gamemode_index = response.formValues[0]
        const gamemode_id = config.gamemodes[gamemode_index].id

        arg.slapper.setDynamicProperty(config.properties.gamemode_id, gamemode_id)
      }
    }
  })
}

/** @param { { player: Player, slapper: Entity} } arg */
function DeactivateSlapper(arg) {
  const DeactivateConfirmationForm = new MessageFormData()
    .title('§cDEACTIVATE SLAPPER')
    .body(
      'Are you sure you want to §cdeactivate§r this slapper? (This will remove all settigs and return the slapper to its default NPC state)'
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

/** @param { { player: Player, slapper: Entity} } arg */
function CreateSlapper(arg) {
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

/** @param { { player: Player, slapper: Entity} } arg */
function RunSlapper(arg) {
  /** @type { number } */
  const gamemode_id = arg.slapper.getDynamicProperty(config.properties.gamemode_id)

  if (gamemode_id !== undefined) {
    const gamemode = config.gamemodes.find(entry => {
      return entry.id === gamemode_id
    })

    if (gamemode !== undefined) {
      arg.player.tryTeleport(gamemode.location, { rotation: gamemode.rotation })
    }
  }
}
