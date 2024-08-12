import { LobbyInstance } from './InstanceClasses'

class GameManager {
  lobbies: LobbyInstance[] = []
}

export const gameManager = new GameManager()
