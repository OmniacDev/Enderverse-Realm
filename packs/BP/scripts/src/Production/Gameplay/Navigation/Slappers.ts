import { Entity, Player, system, world } from '@minecraft/server'
import { MessageFormData, ModalFormData } from '@minecraft/server-ui'
import { Gamemodes } from '../Gamemodes'

export interface SlapperProperties {
  gamemode: string | undefined
  enabled: boolean
}

export const SlapperPropertyID = 'slapper.properties'
export const SlapperConfigItem = 'ec:slapper_config'

// OLD
world.beforeEvents.playerInteractWithEntity.subscribe(data => {
  if (data.target.typeId === 'minecraft:npc') {
    const is_slapper = data.target.getDynamicProperty(SlapperPropertyID) !== undefined

    const args = { player: data.player, slapper: data.target }

    if (data.itemStack?.typeId === SlapperConfigItem && data.player.hasTag('staff')) {
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
    (data.hitEntity.getDynamicProperty(SlapperPropertyID) ?? false)
  ) {
    const args = { player: data.damagingEntity as Player, slapper: data.hitEntity }

    RunSlapper(args)
  }
})

function EditSlapper(arg: { player: Player; slapper: Entity }) {
  const properties = JSON.parse(arg.slapper.getDynamicProperty(SlapperPropertyID) as string) as SlapperProperties

  const gamemode_names = Gamemodes.map(entry => {
    return entry.name
  })
  const selected_gamemode_index = Gamemodes.findIndex(entry => {
    return entry.id === properties.gamemode
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
          properties.gamemode = Gamemodes[gamemode_index].id

          arg.slapper.setDynamicProperty(SlapperPropertyID, JSON.stringify(properties))
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
        arg.slapper.setDynamicProperty(SlapperPropertyID, undefined)
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
        const properties: SlapperProperties = {
          enabled: true,
          gamemode: undefined
        }

        arg.slapper.setDynamicProperty(SlapperPropertyID, JSON.stringify(properties))
        EditSlapper(arg)
      }
    }
  })
}

function RunSlapper(arg: { player: Player; slapper: Entity }) {
  const properties = JSON.parse(arg.slapper.getDynamicProperty(SlapperPropertyID) as string) as SlapperProperties

  if (properties.gamemode) {
    const gamemode = Gamemodes.find(entry => {
      return entry.id === properties.gamemode
    })

    if (gamemode) {
      arg.player.tryTeleport(gamemode.location, { rotation: gamemode.rotation })
    }
  }
}
