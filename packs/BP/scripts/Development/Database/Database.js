import { Entity, Player, World, world } from "@minecraft/server"

import * as config from "../Config/database_config"

const MAX_STR_LENGTH = 32767;



export class Database {
    /** @type {World | Player | Entity} */ #context = null

    get context () {
        return this.#context
    }

    /**
     * @param {World | Player | Entity} context 
     */
    constructor(context) {
        this.#context = context
    }

    /**
     * @param {string} key 
     * @returns {string | number | boolean | undefined}
     */
    get(key) {
        return this.#context.getDynamicProperty(config.properties.prefix + config.properties.seperator + key)
    }

    /**
     * @param {string} key 
     * @param {string | number | boolean} value 
     * @returns {void}
     */
    set(key, value) {
        this.#context.setDynamicProperty(config.properties.prefix + config.properties.seperator + key, value)
    }

    /**
     * @param {string} key 
     * @returns {void}
     */
    delete(key) {
        this.#context.setDynamicProperty(config.properties.prefix + config.properties.seperator + key, undefined)
    }

    getKeys() {
        const properties = this.#context.getDynamicPropertyIds()

        /** @type {string[]} */ const db_keys = []

        properties.forEach(id => {
            const split_id = id.split(config.properties.seperator)
            if (split_id[0] === config.properties.prefix) {
                if (split_id[1] !== undefined && split_id[1] !== '') {
                    db_keys.push(split_id[1])
                }
            }
        })

        return db_keys
    }
}

export class Node {
    /** @type {string} */ #key
    /** @type {Node} */ #parent
    /** @type {Node[]} */ #children
    /** @type {string | number | boolean | undefined} */ #value

    get key () { return this.#key }
    get parent () { return this.#parent }
    get children () { return this.#children }
    get value () { return this.#value }

    /** @param {Node} node */
    set parent (node) { this.#parent = node }

    /** @param {string} key */
    constructor(key) {
        this.#key = key
        this.#parent = undefined
        this.#children = []
        this.#value = undefined
    }

    /**
     * @param {Node} node 
     * @returns {Node}
     */
    addChild(node) {
        node.setParent(this)
        return node
    }

    /**
     * @param {string} key 
     * @returns {Node | undefined}
     */
    getChild(key) {
        this.#children.find(child => child.key === key)
    }

    /**
     * @param {Node} node 
     */
    removeChild(node) {
        this.#children.splice(this.#children.indexOf(node), 1)
    }

    /**
     * @param {Node} node 
     * @returns {void}
     */
    setParent(node) {
        this.#parent?.removeChild(this)
        node.children.push(this)
        this.#parent = node
    }

    /**
     * @param {string | number | boolean} value 
     * @returns {void}
     */
    setValue(value) {
        this.#value = value
    }

    /**
     * @returns {boolean}
     */
    isRoot() {
        return this.#parent === undefined
    }
}

export class NodeDatabase {
    /** @type {World | Player | Entity} */ #context = null

    /** @type {Node} */ #root

    get context () { return this.#context }
    get root () { return this.#root }

    /**
     * @param {World | Player | Entity} context
     */
    constructor(context) {
        this.#context = context
        this.#root = new Node(config.properties.prefix)
    }

    /**
     * @param {Node} node
     * @param {string} parent_key
     * @returns {Node}
     */
    add(node, parent_key = this.#root.key) {
        this.getNodes().find(node => node.key === parent_key).addChild(node)
        return node
    }

    /**
     * @param {string} key 
     * @returns {Node}
     */
    get(key) {
        return this.getNodes().find(node => node.key === key)
    }

    /**
     * @param {Node} node
     * @returns {void}
     */
    remove(node) {
        this.getNodes().find(n => n === node).parent.removeChild(node)
    }

    /**
     * @returns {Node[]}
     */
    getNodes() {
        let node_arr = [this.#root] 

        node_arr.push(...GetNodeChildren(this.#root))

        return node_arr
    }
}

/**
 * @param {Node} node 
 * @returns {string[]}
 */
export function VisualiseNode(node) {
    const str_arr = ['- ' + node.key + (node.value !== undefined ? ': ' + node.value : '')]

    node.children.forEach(child => {
        const child_str_arr = VisualiseNode(child).map(str => {
            return '  ' + str
        })

        str_arr.push(...child_str_arr)
    })

    return str_arr
}

/**
 * @param {Node} node
 * @returns {string}
 */
export function GetNodePath(node) {
    return node.isRoot() ? (node.key) : (GetNodePath(node.parent) + config.properties.seperator + node.key)
}

/**
 * @param {Node} node
 * @returns {Node[]} 
 */
export function GetNodeChildren(node) {
    const child_arr = [...node.children]

    child_arr.forEach(child => {
        child_arr.push(...GetNodeChildren(child))
    })

    return child_arr
}