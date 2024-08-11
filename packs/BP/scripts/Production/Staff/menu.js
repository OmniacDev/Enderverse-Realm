import { Player, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

import { GetRoles, GetDefaultRole, CreateRole, EditRole, SetDefaultRole, DeleteRole, GetPlayerRole, SetPlayerRole } from "../Social/Roles/roles";

// import * as role_config from "../Config/roles_config"

world.beforeEvents.itemUse.subscribe(data => {
    if (data.itemStack.typeId === "ec:admin_menu" && data.source.hasTag('staff')) {
        data.cancel = true

        system.run(() => {
            new ActionFormData()
                .title(`Admin Menu`)
                .button(`Roles`)
                .button(`Players`)
                .show(data.source).then(response => {
                    if (!response.canceled) {
                        switch (response.selection) {
                            case 0:
                                new ActionFormData()
                                    .title(`Roles`)
                                    .button(`Global Roles`)
                                    .button(`Default Role\n§8[ §r${GetDefaultRole()} §8]`)
                                    .show(data.source).then(response => {
                                        if (!response.canceled) {
                                            switch (response.selection) {
                                                case 0:
                                                    new ActionFormData()
                                                        .title(`Global Roles`)
                                                        .button(`Edit Roles`)
                                                        .button(`Create Role`)
                                                        .show(data.source).then(response => {
                                                            if (!response.canceled) {
                                                                switch (response.selection) {
                                                                    case 0: 

                                                                        const roles = GetRoles()

                                                                        if (roles.length === 0) {
                                                                            new MessageFormData()
                                                                                .title(`Global Roles`)
                                                                                .body(`It looks like you don't have any global roles set up yet. Would you like to create a new one?`)
                                                                                .button1(`No`)
                                                                                .button2(`Yes`)
                                                                                .show(data.source).then(response => {
                                                                                    if (!response.canceled) {
                                                                                        if (response.selection === 1) {
                                                                                            new ModalFormData()
                                                                                                .title(`Create Role`)
                                                                                                .textField(``, `Unnamed`)
                                                                                                .show(data.source).then(response => {
                                                                                                    if (!response.canceled) {
                                                                                                        CreateRole(response.formValues[0])
                                                                                                    }
                                                                                                })
                                                                                        }
                                                                                    }
                                                                                })
                                                                        }
                                                                        else {
                                                                            const ViewRolesMenuForm = new ActionFormData()
                                                                                .title(`View Roles`)
                                                                                .body(`Click a role to edit or delete it`)
                        
                                                                            roles.forEach(role => {
                                                                                ViewRolesMenuForm.button(role)
                                                                            })
                        
                                                                            ViewRolesMenuForm.show(data.source).then(response => {
                                                                                if (!response.canceled) {
                                                                                        const selected_role = roles[response.selection]
                        
                                                                                        new ModalFormData()
                                                                                            .title(`Edit Role: ${selected_role}`)
                                                                                            .textField(``, selected_role)
                                                                                            .toggle(`§cDelete?`, false)
                                                                                            .show(data.source).then(response => {
                                                                                                if (!response.canceled) {
                                                                                                    if (response.formValues[1] === true) {
                                                                                                        DeleteRole(selected_role)
                                                                                                    }
                                                                                                    else {
                                                                                                        EditRole(selected_role, response.formValues[0])
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                }
                                                                            })
                                                                        }
                                                                        break
                                                                    case 1:
                                                                        new ModalFormData()
                                                                            .title(`Create Role`)
                                                                            .textField(``, `Unnamed`)
                                                                            .show(data.source).then(response => {
                                                                                if (!response.canceled) {
                                                                                    CreateRole(response.formValues[0])
                                                                                }
                                                                            })
                                                                        break
                                                                    default:
                                                                        break
                                                                }
                                                            }
                                                        })
                                                    break
                                                case 1:
                                                    new ModalFormData()
                                                        .title(`Edit Default Role: §r${GetDefaultRole()}`)
                                                        .textField(``, GetDefaultRole())
                                                        .show(data.source).then(response => {
                                                            if (!response.canceled) {
                                                                SetDefaultRole(response.formValues[0])
                                                            }
                                                        })
                                                    break
                                                default:
                                                    break
                                            }
                                        }
                                    })
                                break
                            case 1:
                                const PlayersForm = new ActionFormData()
                                    .title(`Players`)
                                    .body(`Select a player to see more options`)

                                const players = world.getAllPlayers()

                                players.forEach(player => {
                                    PlayersForm.button(player.name)
                                })

                                PlayersForm.show(data.source).then(response => {
                                    if (!response.canceled) {
                                        /** @type { Player } */
                                        const selected_player = players[response.selection]

                                        new ActionFormData()
                                            .title(`Player: ${selected_player.name}`)
                                            .button(`Role: ${GetPlayerRole(selected_player)}`)
                                            .show(data.source).then(response => {
                                                if (!response.canceled) {
                                                    switch (response.selection) {
                                                        case 0:
                                                            new ActionFormData()
                                                                .title(`Set ${selected_player.name}'s Role`)
                                                                .button(`Global Role`)
                                                                .button(`Custom Role`)
                                                                .show(data.source).then(response => {
                                                                    if (!response.canceled) {
                                                                        switch (response.selection) {
                                                                            case 0:
                                                                                const roles = GetRoles()

                                                                                if (roles.length === 0) {
                                                                                    new MessageFormData()
                                                                                        .title(`Global Roles`)
                                                                                        .body(`It looks like you don't have any global roles set up yet. Would you like to use a custom one?`)
                                                                                        .button1(`No`)
                                                                                        .button2(`Yes`)
                                                                                        .show(data.source).then(response => {
                                                                                            if (!response.canceled) {
                                                                                                if (response.selection === 1) {
                                                                                                    new ModalFormData()
                                                                                                        .title(`Custom Role`)
                                                                                                        .textField(``, `Unnamed`)
                                                                                                        .show(data.source).then(response => {
                                                                                                            if (!response.canceled) {
                                                                                                                SetPlayerRole(selected_player, response.formValues[0])
                                                                                                            }
                                                                                                        })
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                }
                                                                                else {
                                                                                    const PlayerRoleGlobalForm = new ActionFormData()
                                                                                        .title(`Global Roles`)
                                
                                                                                    roles.forEach(role => {
                                                                                        PlayerRoleGlobalForm.button(role)
                                                                                    })
                                
                                                                                    PlayerRoleGlobalForm.show(data.source).then(response => {
                                                                                        if (!response.canceled) {
                                                                                                const selected_role = roles[response.selection]
                                                                                                SetPlayerRole(selected_player, selected_role)
                                                                                        }
                                                                                    })
                                                                                }                                                                                
                                                                                break
                                                                            case 1:
                                                                                new ModalFormData()
                                                                                    .title(`Custom Role`)
                                                                                    .textField(``, `Unnamed`)
                                                                                    .show(data.source).then(response => {
                                                                                        if (!response.canceled) {
                                                                                            SetPlayerRole(selected_player, response.formValues[0])
                                                                                        }
                                                                                    })
                                                                                break
                                                                            default:
                                                                                break
                                                                        }
                                                                    }
                                                                })
                                                            break
                                                        default:
                                                            break
                                                    }
                                                }
                                            })
                                    }
                                })
                                break
                            default:
                                break
                        }
                    }
                })
        })
    }
})