import { BaseMonitor } from "../structures/BaseMonitor"
import { FlintClient } from "../client/FlintClient"
import { BaseHandler } from "./BaseHandler"
import { Message } from "@fluxerjs/core"

export class MonitorHandler extends BaseHandler<BaseMonitor> {

    register(monitor: BaseMonitor): this {
        this.store.set(monitor.name, monitor)
        return this
    }

    async run(client: FlintClient, message: Message): Promise<void> {
        for (const monitor of this.store.values()) {
            if (monitor.disabled) continue
            if (!monitor.allowBots && message.author?.bot) continue
            if (!monitor.allowDMs && message.channel?.isDM()) continue
            await monitor.run(client, message)
        }
    }

}
