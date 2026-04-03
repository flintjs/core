import type { BaseListener, WithClient, ExtendedListeners } from "../structures/BaseListener"
import { FlintClient } from "../client/FlintClient"
import type { Awaitable } from "../types"

export function defineListener<
    TClient extends FlintClient = FlintClient,
    K extends keyof ExtendedListeners = keyof ExtendedListeners
>(
    event: Omit<BaseListener<K>, "execute"> & Record<string, any> & {
        execute(this: BaseListener<K> & Record<string, any>, client: TClient, ...args: ExtendedListeners[K]): Awaitable<void>
    }
): typeof event {
    return event
}
