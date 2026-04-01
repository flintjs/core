import type { BaseListener, WithClient, ExtendedListeners } from "../structures/BaseListener"
import type { Awaitable } from "../types"

export function defineListener<K extends keyof ExtendedListeners>(
    event: BaseListener<K> & Record<string, any> & {
        execute(this: BaseListener<K> & Record<string, any>, ...args: WithClient<ExtendedListeners[K]>): Awaitable<void>
    }
): BaseListener<K> {
    return event
}
