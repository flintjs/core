import { FlintClient } from "../client/FlintClient"
import { SpamFilter } from "./built-in/SpamFilter"
import { BaseMonitor } from "./BaseMonitor"
import { Message } from "@fluxerjs/core"

export class MonitorStore {

    #monitors: BaseMonitor[] = [
        new SpamFilter()
    ]

    register(monitor: BaseMonitor): void {
        this.#monitors.push(monitor)
    }

    async run(client: FlintClient, message: Message): Promise<void> {
        for (const monitor of this.#monitors) {
            if (monitor.disabled) continue
            if (!monitor.allowBots && message.author?.bot) continue
            if (!monitor.allowDMs && message.channel?.isDM()) continue
            await monitor.run(client, message)
        }
    }
}
