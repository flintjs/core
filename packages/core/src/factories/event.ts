import type { FlintClient } from "../client/FlintClient"
import type { Awaitable, FlintEvents } from "../types"
import type { ClientEvents } from "@fluxerjs/core"

type WithClient<T extends unknown[]> = [client: FlintClient, ...T]
export type ExtendedEvents = ClientEvents & FlintEvents

export interface FlintEvent<K extends keyof ExtendedEvents> {
    event: K
    name: string
    once?: boolean
    priority?: number
    execute(...args: WithClient<ExtendedEvents[K]>): Awaitable<void>
}

export function defineEvent<K extends keyof ExtendedEvents>(
    event: FlintEvent<K> & Record<string, any> & {
        execute(this: FlintEvent<K> & Record<string, any>, ...args: WithClient<ExtendedEvents[K]>): Awaitable<void>
    }
): FlintEvent<K> {
    return event
}
