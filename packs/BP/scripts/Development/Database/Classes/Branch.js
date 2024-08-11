import { Leaf } from "./Leaf"

export class Branch {
    /** @type {string} @protected */ _id
    /** @type {Branch} @protected */ _parent
    /** @type {(Branch | Leaf)[]} @protected */ _children

    /** 
     * @param {string} id 
     * @param {Branch} parent
     */
    constructor(id, parent = undefined) {
        this._id = id

        parent?.children.push(this)
        this._parent = parent

        this._children = []
    }

    get id () { return this._id }
    get parent () { return this._parent }
    get children () { return this._children }

    set parent (branch) {
        this._parent?.remove(this)
        branch?.children.push(this)
        this._parent = branch
    }

    /** @param {Branch | Leaf} obj  */
    add(obj) {
        obj.parent = this
        return obj
    }
    
    /** @param {string} id  */
    get(id) {
        return this._children.find(child => child.id === id)
    }

    /** @param {Branch | Leaf} obj  */
    remove(obj) {
        this._children.splice(this._children.indexOf(obj), 1)
    }

    /**
     * Progressively removes empty child branches
     * @returns {void}
     */
    prune() {
        this._children.forEach(child => {
            if (child instanceof Branch) {
                if (child.children.length === 0) {
                    this._children.splice(this._children.indexOf(child), 1)
                }
                else {
                    child.prune()

                    if (child.children.length === 0) {
                        this._children.splice(this._children.indexOf(child), 1)
                    }
                }
            }
        })
    }

    /**
     * @returns {boolean}
     */
    isRoot () { 
        return this._parent === undefined 
    }
}