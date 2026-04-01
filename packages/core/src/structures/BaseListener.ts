import type { FlintListeners, Awaitable } from "../types"
import type { FlintClient } from "../client/FlintClient"
import type { ClientEvents } from "@fluxerjs/core"

export type WithClient<T extends unknown[]> = [FlintClient, ...T]
export type ExtendedListeners = ClientEvents & FlintListeners

export abstract class BaseListener<K extends keyof ExtendedListeners = keyof ExtendedListeners> {
    public readonly event: K
    public readonly name: string
    public readonly once?: boolean
    public readonly priority?: number

    constructor(options: {
        event: K
        name: string
        once?: boolean
        priority?: number
    }) {
        this.event = options.event
        this.name = options.name
        this.once = options.once
        this.priority = options.priority
    }

    abstract execute(...args: WithClient<ExtendedListeners[K]>): Awaitable<void>
}
