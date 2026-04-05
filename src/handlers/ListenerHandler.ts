import { BaseListener } from "../structures/BaseListener.js"
import { BaseHandler } from "./BaseHandler.js"

export class ListenerHandler extends BaseHandler<BaseListener> {

    register(monitor: BaseListener): this {
        this.store.set(monitor.name, monitor)
        return this
    }

    async loadAll(): Promise<this> {
        await super.loadAll()
        for (const listener of this.store.values()) {
            const method = listener.once ? "once" : "on"
            this.client[method](listener.event as string, (...args: any[]) =>
                (listener.execute as Function)(this.client, ...args)
            )
        }
        return this
    }

}
