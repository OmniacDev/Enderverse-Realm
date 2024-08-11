import { Entity, ItemStack, Player, World } from '@minecraft/server'
import { Branch } from './Branch'
import { Leaf } from './Leaf'

export class Tree {
  /** @type {Branch} @protected */ _root

  get root() {
    return this._root
  }

  /**
   * @param {string} id
   */
  constructor(id) {
    this._root = new Branch(id)
  }
}

export class PropertyTree {
  /** @type {Branch} @protected */ _root
  /** @type {World | Player | Entity | ItemStack} @protected */ _context

  get root() {
    return this._root
  }
  get context() {
    return this._context
  }

  /**
   * @param {World | Player | Entity | ItemStack} context
   * @param {string} id
   */
  constructor(context, id = 'database') {
    this._context = context
    this._root = new Branch(id)
  }

  // update() {
  //
  //     // Update properties from values first (non-destructive)
  //
  //     /** @param {Branch} branch  */
  //     function property_iter(branch) {
  //         /** @type {{property: string, value: string | number | boolean}[]} */
  //         const property_leaves = []
  //
  //         branch.children.forEach(child => {
  //             if (child instanceof Branch) {
  //                 property_leaves.push(...property_iter(child))
  //             }
  //
  //             if (child instanceof Leaf) {
  //                 property_leaves.push({property: child.path, value: child.value})
  //             }
  //         })
  //
  //         return property_leaves
  //     }
  //
  //     property_iter(this._root).forEach(property_leaf => {
  //         this._context.setDynamicProperty(property_leaf.property, property_leaf.value)
  //     })
  //
  //     // Then update the tree from properties (destructive)
  //
  //     // /** @param {} */
  //     // function tree_iter() {
  //     // }
  //
  //     this._context.getDynamicPropertyIds().filter(property => property.startsWith(this._root.id)).forEach(property => {
  //         const split = property.split(':')
  //
  //         split.forEach(id => {
  //             if (id === this._root.id) return
  //
  //
  //         })
  //
  //         const leaf_id = split[split.length-1]
  //
  //         const leaf = new Leaf(leaf_id)
  //     })
  // }
}

/**
 * @param {string} path
 * @param {World | Player | Entity | ItemStack} context
 * @returns {Branch}
 */
export function PathToTree(path, context) {
  const leaf_value = context.getDynamicProperty(path)

  const ids = path.split(':')
  const ids_len = ids.length

  const leaf_id = ids[ids_len - 1]

  const leaf = new Leaf(leaf_id, undefined, leaf_value)

  /**
   * @param {string[]} ids_arr
   * @param {number} current
   * @param {Branch | Leaf} input
   * */
  function iter(ids_arr, current, input) {
    if (current === 0) return
    const i = current - 1

    const branch = new Branch(ids_arr[i])

    input.parent = branch

    iter(ids_arr, i, branch)
  }

  iter(ids, ids_len - 1, leaf)
}

/**
 * @param {Branch} branch
 * @returns {string}
 */
export function VisualiseTree(branch) {
  /** @param {Branch | Leaf} obj */
  function iter(obj) {
    if (obj instanceof Branch) {
      const str_arr = ['- ' + obj.id]

      obj.children.forEach(child => {
        const child_str_arr = iter(child).map(str => {
          return '  ' + str
        })

        str_arr.push(...child_str_arr)
      })

      return str_arr
    }

    if (obj instanceof Leaf) {
      return ['- ' + obj.id + ': ' + obj.value]
    }

    return []
  }

  return iter(branch).join('\n')
}
