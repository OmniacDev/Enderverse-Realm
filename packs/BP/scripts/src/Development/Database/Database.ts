import { Entity, Player, Vector3, World } from '@minecraft/server'

import * as config from '../Config/database_config'

// const MAX_STR_LENGTH = 32767;

export class Database {
  readonly #context: World | Player | Entity | undefined = undefined

  get context() {
    return this.#context
  }

  constructor(context: World | Player | Entity) {
    this.#context = context
  }

  get(key: string): string | number | boolean | Vector3 | undefined {
    return this.#context?.getDynamicProperty(config.properties.prefix + config.properties.seperator + key)
  }


  set(key: string, value: string | number | boolean) {
    this.#context?.setDynamicProperty(config.properties.prefix + config.properties.seperator + key, value)
  }

  delete(key: string) {
    this.#context?.setDynamicProperty(config.properties.prefix + config.properties.seperator + key, undefined)
  }

  getKeys() {
    const properties = this.#context?.getDynamicPropertyIds()

    const db_keys: string[] = []

    if (properties) {
      properties.forEach(id => {
        const split_id = id.split(config.properties.seperator)
        if (split_id[0] === config.properties.prefix) {
          if (split_id[1] !== undefined && split_id[1] !== '') {
            db_keys.push(split_id[1])
          }
        }
      })
    }

    return db_keys
  }
}

export class Node {
  readonly #key: string
  #parent: Node | undefined
  readonly #children: Node[]
  #value: string | number | boolean | undefined

  get key() {
    return this.#key
  }
  get parent(): Node | undefined {
    return this.#parent
  }
  get children() {
    return this.#children
  }
  get value() {
    return this.#value
  }


  set parent(node: Node) {
    this.#parent = node
  }

  constructor(key: string) {
    this.#key = key
    this.#parent = undefined
    this.#children = []
    this.#value = undefined
  }

  addChild(node: Node): Node {
    node.setParent(this)
    return node
  }

  getChild(key: string): Node | undefined {
    return this.#children.find(child => child.key === key)
  }

  removeChild(node: Node) {
    this.#children.splice(this.#children.indexOf(node), 1)
  }

  setParent(node: Node) {
    this.#parent?.removeChild(this)
    node.children.push(this)
    this.#parent = node
  }

  setValue(value: string | number | boolean) {
    this.#value = value
  }

  isRoot(): boolean {
    return this.#parent === undefined
  }
}

export class NodeDatabase {
  readonly #context: World | Player | Entity | undefined = undefined
  readonly #root: Node

  get context() {
    return this.#context
  }
  get root() {
    return this.#root
  }

  /**
   * @param {} context
   */
  constructor(context: World | Player | Entity) {
    this.#context = context
    this.#root = new Node(config.properties.prefix)
  }

  add(node: Node, parent_key: string = this.#root.key): Node {
    this.getNodes().find(node => node.key === parent_key)?.addChild(node)
    return node
  }

  get(key: string): Node | undefined {
    return this.getNodes().find(node => node.key === key)
  }


  remove(node: Node) {
    this.getNodes().find(n => n === node)?.parent?.removeChild(node)
  }

  getNodes(): Node[] {
    const node_arr = [this.#root]

    node_arr.push(...GetNodeChildren(this.#root))

    return node_arr
  }
}

export function VisualiseNode(node: Node): string[] {
  const str_arr = ['- ' + node.key + (node.value !== undefined ? ': ' + node.value : '')]

  node.children.forEach(child => {
    const child_str_arr = VisualiseNode(child).map(str => {
      return '  ' + str
    })

    str_arr.push(...child_str_arr)
  })

  return str_arr
}

export function GetNodePath(node: Node): string {
  return node.parent === undefined ? node.key : GetNodePath(node.parent) + config.properties.seperator + node.key
}

export function GetNodeChildren(node: Node): Node[] {
  const child_arr = [...node.children]

  child_arr.forEach(child => {
    child_arr.push(...GetNodeChildren(child))
  })

  return child_arr
}
