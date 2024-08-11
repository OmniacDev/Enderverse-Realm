import { Player, world } from '@minecraft/server'

import { roles_config as config } from '../../Config/config'

world.afterEvents.playerSpawn.subscribe(data => {
  if (data.initialSpawn) {
    data.player.nameTag = `§8[§r${GetPlayerRole(data.player)}§8]§r ${data.player.name}`
  }
})

export function GetRoles() {
  /** @type {string} */
  let roles_string = world.getDynamicProperty(config.properties.global_roles)

  if (roles_string === undefined) {
    world.setDynamicProperty(config.properties.global_roles, '[]')
  }

  return JSON.parse(roles_string)
}

export function GetDefaultRole() {
  /** @type {string} */
  let default_role = world.getDynamicProperty(config.properties.world_default_role)

  if (default_role === undefined) {
    world.setDynamicProperty(config.properties.world_default_role, config.default_role)
    default_role = world.getDynamicProperty(config.properties.world_default_role)
  }

  return default_role
}

/** @param {string} role */
export function SetDefaultRole(role) {
  world.setDynamicProperty(config.properties.world_default_role, role)
}

/** @param {string} role */
export function CreateRole(role) {
  let roles = GetRoles()

  roles.push(role)

  let roles_string = JSON.stringify(roles)

  world.setDynamicProperty(config.properties.global_roles, roles_string)
}

/** @param {string} role */
export function DeleteRole(role) {
  let roles = GetRoles()

  roles.splice(roles.indexOf(role), 1)

  let roles_string = JSON.stringify(roles)

  world.setDynamicProperty(config.properties.global_roles, roles_string)
}

/**
 * @param {string} role
 * @param {string} new_role
 */
export function EditRole(role, new_role) {
  let roles = GetRoles()

  roles[roles.indexOf(role)] = new_role

  let roles_string = JSON.stringify(roles)

  world.setDynamicProperty(config.properties.global_roles, roles_string)
}

/** @param {Player} player */
export function GetPlayerRole(player) {
  /** @type { string } */
  let role = player.getDynamicProperty(config.properties.player_role)

  if (role === undefined) {
    player.setDynamicProperty(config.properties.player_role, GetDefaultRole())
    role = player.getDynamicProperty(config.properties.player_role)
  }

  return role
}

/**
 * @param {Player} player
 * @param {string} role
 */
export function SetPlayerRole(player, role) {
  player.setDynamicProperty(config.properties.player_role, role)
}
