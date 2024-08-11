export class BeforeEvent {
    cancel: boolean;
}

export class BeforeEventSignal {

    #listeners: ((arg: BeforeEvent) => void)[]

    subscribe(callback: (arg: BeforeEvent) => void): (arg: BeforeEvent) => void

    unsubscribe(callback: (arg: BeforeEvent) => void): (arg: BeforeEvent) => void

    broadcast(arg: BeforeEvent): BeforeEvent
}