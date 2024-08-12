import { Player, world } from '@minecraft/server'

const config = {
  properties: {
    world_default_role: 'Development.default_role',
    global_roles: 'Development.global_roles',
    player_role: 'Development.player_role'
  },
  default_role: '§bMember'
}

world.afterEvents.playerSpawn.subscribe(data => {
  if (data.initialSpawn) {
    data.player.nameTag = `§8[§r${GetPlayerRole(data.player)}§8]§r ${data.player.name}`
  }
})

export type Role = string

export function GetRoles(): Role[] {
  let roles_string = world.getDynamicProperty(config.properties.global_roles) as string

  if (roles_string === undefined) {
    world.setDynamicProperty(config.properties.global_roles, '[]')
    roles_string = '[]'
  }

  return JSON.parse(roles_string)
}

export function GetDefaultRole(): Role {
  let default_role = world.getDynamicProperty(config.properties.world_default_role) as string

  if (default_role === undefined) {
    world.setDynamicProperty(config.properties.world_default_role, config.default_role)
    default_role = world.getDynamicProperty(config.properties.world_default_role) as string
  }

  return default_role
}

export function SetDefaultRole(role: Role) {
  world.setDynamicProperty(config.properties.world_default_role, role)
}

export function CreateRole(role: Role) {
  const roles = GetRoles()

  roles.push(role)

  const roles_string = JSON.stringify(roles)
  world.setDynamicProperty(config.properties.global_roles, roles_string)
}

export function DeleteRole(role: Role) {
  const roles = GetRoles()

  roles.splice(roles.indexOf(role), 1)

  const roles_string = JSON.stringify(roles)

  world.setDynamicProperty(config.properties.global_roles, roles_string)
}

export function EditRole(role: Role, new_role: Role) {
  const roles = GetRoles()

  roles[roles.indexOf(role)] = new_role

  const roles_string = JSON.stringify(roles)

  world.setDynamicProperty(config.properties.global_roles, roles_string)
}

export function GetPlayerRole(player: Player): Role {
  let role = player.getDynamicProperty(config.properties.player_role) as string

  if (role === undefined) {
    player.setDynamicProperty(config.properties.player_role, GetDefaultRole())
    role = player.getDynamicProperty(config.properties.player_role) as string
  }

  return role
}

export function SetPlayerRole(player: Player, role: string) {
  player.setDynamicProperty(config.properties.player_role, role)
}
