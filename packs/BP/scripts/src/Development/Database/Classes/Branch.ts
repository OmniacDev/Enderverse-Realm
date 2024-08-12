import { Leaf } from './Leaf'

export class Branch {
  _id: string
  _parent: Branch | undefined
  _children: (Branch | Leaf)[]

  constructor(id: string, parent: Branch | undefined = undefined) {
    this._id = id

    parent?.children.push(this)
    this._parent = parent

    this._children = []
  }

  get id() {
    return this._id
  }
  get parent() {
    return this._parent
  }
  get children() {
    return this._children
  }

  set parent(branch) {
    this._parent?.remove(this)
    branch?.children.push(this)
    this._parent = branch
  }

  add(obj: Branch | Leaf) {
    obj.parent = this
    return obj
  }

  get(id: string) {
    return this._children.find(child => child.id === id)
  }

  remove(obj: Branch | Leaf) {
    this._children.splice(this._children.indexOf(obj), 1)
  }

  prune(): void {
    this._children.forEach(child => {
      if (child instanceof Branch) {
        if (child.children.length === 0) {
          this._children.splice(this._children.indexOf(child), 1)
        } else {
          child.prune()

          if (child.children.length === 0) {
            this._children.splice(this._children.indexOf(child), 1)
          }
        }
      }
    })
  }

  isRoot(): boolean {
    return this._parent === undefined
  }
}
