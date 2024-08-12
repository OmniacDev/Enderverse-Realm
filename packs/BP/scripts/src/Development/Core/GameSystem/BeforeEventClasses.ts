export class BeforeEventSignal {
  #listeners: ((arg: any) => any)[] = []

  subscribe(callback: (arg: any) => any) {
    this.#listeners.push(callback)
    return callback
  }

  unsubscribe(callback: (arg: any) => any) {
    this.#listeners.splice(this.#listeners.findIndex(data => data === callback))
  }

  broadcast(arg: any) {
    this.#listeners.forEach(callback => {
      callback(arg)
    })

    return arg
  }
}
