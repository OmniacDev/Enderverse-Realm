import { Entity, Vector3, world } from '@minecraft/server'
import { ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui'

world.beforeEvents.worldInitialize.subscribe(event => {
    event.itemComponentRegistry.registerCustomComponent('ec:text_config_component', {
        onUse(event) {
            const text_entities = event.source.dimension.getEntities({ location: event.source.location, maxDistance: 16, type: 'ec:floating_text'})
            text_entities.forEach(text => event.source.spawnParticle('minecraft:villager_happy', { x: text.location.x, y: text.location.y + 0.05,z: text.location.z }))

            const text_entity = event.source.getEntitiesFromViewDirection({maxDistance: 4})
                .filter(hit => hit.entity.typeId === 'ec:floating_text')
                .sort((hit1, hit2) => hit1.distance - hit2.distance)[0]?.entity

            if (text_entity && event.source.hasTag('staff')) {
                const main_form = new ActionFormData()
                    .title('Floating Text Editor')
                    .button('Edit Text')
                    .button('Edit Position')
                    .button('Delete')

                const edit_text_form = new ModalFormData()
                    .title('Edit Text')
                    .textField('', '', text_entity.nameTag.replace(/\n/g,'\\n'))
                    .submitButton('Confirm')

                const edit_position_form = new ModalFormData()
                    .title('Edit Text')
                    .textField('X', '', text_entity.location.x.toString())
                    .textField('Y', '', text_entity.location.y.toString())
                    .textField('Z', '', text_entity.location.z.toString())
                    .submitButton('Confirm')

                const confirm_delete_form = new MessageFormData()
                    .title('Delete')
                    .body('Are you sure you want to delete this floating text?')
                    .button1('No')
                    .button2('Yes')
                
                main_form.show(event.source).then(response => {
                    if (!response.canceled) {
                        switch(response.selection) {
                            case 0: {
                                edit_text_form.show(event.source).then(response => {
                                    if (!response.canceled && response.formValues) {
                                        const split_name = (response.formValues[0] as string).replace(/\\n/g, '\n')
                                        text_entity.nameTag = split_name
                                    }
                                })
                                break
                            }
                            case 1: {
                                edit_position_form.show(event.source).then(response => {
                                    if (!response.canceled && response.formValues) {
                                        const x = parseFloat(response.formValues[0] as string)
                                        const y = parseFloat(response.formValues[1] as string)
                                        const z = parseFloat(response.formValues[2] as string)
                                        text_entity.tryTeleport({x, y, z})
                                    }
                                })
                                break
                            }
                            case 2: {
                                confirm_delete_form
                                    .show(event.source)
                                    .then(response => {
                                        if (!response.canceled) {
                                            if (response.selection === 1) {
                                                text_entity.remove()
                                            }
                                        }
                                    })
                            }
                            default: break
                        }
                    }
                })
            }
        }
    })
})