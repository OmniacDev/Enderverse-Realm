import { Branch } from "./Branch"

export class Leaf {
    /** @type {string} @protected */ _id
    /** @type {Branch} @protected */ _parent
    /** @type {string | number | boolean} @protected */ _value

    /** 
     * @param {string} id 
     * @param {Branch} parent 
     * @param {string | number | boolean} value 
     */
    constructor(id, parent = undefined, value = undefined) {
        this._id = id

        parent?.children.push(this)
        this._parent = parent

        this._value = value
    }

    get id () { return this._id }
    get parent () { return this._parent }
    get value () { return this._value }

    get path () {
        /** @param {Branch} branch @returns {string} */
        function iter(branch) {
            if (branch.isRoot()) return branch.id
            else return iter(branch.parent) + ':' + branch.id
        }

        return iter(this.parent) + ':'+ this.id
    }

    set parent (branch) {
        this._parent?.remove(this)
        branch?.children.push(this)
        this._parent = branch
    }

    set value (value) {
        this._value = value
    }
}