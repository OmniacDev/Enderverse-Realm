import { Vector2, Vector3 } from '@minecraft/server'

export interface Gamemode {
  name: string
  id: string
  location: Vector3
  rotation: Vector2
}

export const Gamemodes: Gamemode[] = [
  {
    name: 'KitPvP',
    id: 'kitpvp',
    location: { x: -120.5, y: 75, z: -799.5 },
    rotation: { x: 0, y: -90 }
  },
  {
    name: 'Adventure',
    id: 'adventure',
    location: { x: 963.5, y: 84, z: 855.5 },
    rotation: { x: 0, y: 0 }
  },
  {
    name: 'Arcade',
    id: 'arcade',
    location: { x: 7018.5, y: 110, z: 7025.5 },
    rotation: { x: 0, y: 180 }
  },
  {
    name: 'Skywars',
    id: 'skywars',
    location: { x: -4995.5, y: 296, z: -4989.5 },
    rotation: { x: 0, y: 90 }
  },
  {
    name: 'Bridge',
    id: 'bridge',
    location: { x: 7534.5, y: 296, z: 8023.5 },
    rotation: { x: 0, y: 90 }
  },
  {
    name: 'Spleef',
    id: 'spleef',
    location: { x: 825.5, y: 118, z: -370.5 },
    rotation: { x: 0, y: 0 }
  }
]
