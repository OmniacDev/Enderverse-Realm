export class BeforeEventSignal {
    
    #listeners = []

    subscribe(callback) {
        this.#listeners.push(callback)
        return callback
    }

    unsubscribe(callback) {
        this.#listeners.splice(this.#listeners.findIndex(data => data === callback))
    }

    broadcast(arg) {
        this.#listeners.forEach(callback => {
            callback(arg)
        })
        
        return arg
    }
}