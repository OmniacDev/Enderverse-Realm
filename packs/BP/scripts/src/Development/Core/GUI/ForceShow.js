import { Player, system } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

/**
 * @template {ActionFormData | MessageFormData | ModalFormData} FormData
 * @param {Player} player
 * @param {FormData} form
 * @param {number} timeout
 * @returns {Promise<Awaited<ReturnType<FormData["show"]>>>}
 */

export async function forceShow(player, form, timeout = Infinity) {
    const startTick = system.currentTick;
    
    while ((system.currentTick - startTick) < timeout) {
        const response = await /** @type {ReturnType<FormData["show"]>} */(form.show(player));
        if (response.cancelationReason !== "userBusy") {
            return response;
        }
    }
    throw new Error(`Timed out after ${timeout} ticks`);
}