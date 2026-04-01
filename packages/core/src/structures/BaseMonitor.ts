import type { FlintClient } from "../client/FlintClient"
import type { Message } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export interface BaseMonitorOptions {
    name: string
    disabled?: boolean
    allowBots?: boolean
    allowDMs?: boolean
}

export abstract class BaseMonitor {
    public readonly name: string
    public readonly disabled?: boolean
    public readonly allowBots?: boolean
    public readonly allowDMs?: boolean

    constructor(options: BaseMonitorOptions) {
        this.name = options.name
        this.disabled = options.disabled
        this.allowBots = options.allowBots
        this.allowDMs = options.allowDMs
    }

    abstract run(client: FlintClient, message: Message): Awaitable<void>
}
