import { Branch } from './Branch'

export class Leaf {
  protected _id: string
  protected _parent: Branch | undefined
  protected _value: string | number | boolean | undefined

  constructor(
    id: string,
    parent: Branch | undefined = undefined,
    value: string | number | boolean | undefined = undefined
  ) {
    this._id = id

    parent?.children.push(this)
    this._parent = parent

    this._value = value
  }

  get id() {
    return this._id
  }
  get parent() {
    return this._parent
  }
  get value() {
    return this._value
  }

  get path() {
    function iter(branch: Branch): string {
      if (branch.parent === undefined) return branch.id
      else return iter(branch.parent) + ':' + branch.id
    }

    return this.parent === undefined ? this.id : iter(this.parent) + ':' + this.id
  }

  set parent(branch) {
    this._parent?.remove(this)
    branch?.children.push(this)
    this._parent = branch
  }

  set value(value) {
    this._value = value
  }
}
