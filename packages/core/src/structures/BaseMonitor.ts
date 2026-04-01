import type { FlintClient } from "../client/FlintClient"
import type { Message } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export interface BaseMonitorOptions {
    disabled?: boolean
    allowBots?: boolean
    allowDMs?: boolean
}

export abstract class BaseMonitor {
    public readonly name: string
    public readonly disabled?: boolean
    public readonly allowBots?: boolean
    public readonly allowDMs?: boolean

    constructor(name: string, options: BaseMonitorOptions) {
        this.name = name
        this.disabled = options.disabled
        this.allowBots = options.allowBots
        this.allowDMs = options.allowDMs
    }

    abstract run(client: FlintClient, message: Message): Awaitable<void>
}
