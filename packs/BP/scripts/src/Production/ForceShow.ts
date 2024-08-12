import { Player, system } from '@minecraft/server'
import { ActionFormData, FormCancelationReason, MessageFormData, ModalFormData } from '@minecraft/server-ui'

type FormData = ActionFormData | MessageFormData | ModalFormData

export async function ForceShow(
  player: Player,
  form: FormData,
  timeout: number = Infinity
): Promise<Awaited<ReturnType<FormData['show']>>> {
  const startTick = system.currentTick

  while (system.currentTick - startTick < timeout) {
    const response = await form.show(player)
    if (response.cancelationReason !== FormCancelationReason.UserBusy) {
      return response
    }
  }
  throw new Error(`Timed out after ${timeout} ticks`)
}
