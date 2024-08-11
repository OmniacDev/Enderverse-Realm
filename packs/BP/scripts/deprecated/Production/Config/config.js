export const roles_config = {
  properties: {
    world_default_role: 'Development.default_role',
    global_roles: 'Development.global_roles',
    player_role: 'Development.player_role'
  },
  default_role: '§bMember'
}

export const slapper_config = {
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
