import { FlintClient } from "../client/FlintClient"
import { Message } from "@fluxerjs/core"
import { Awaitable } from "../types"

export abstract class BaseMonitor {
    abstract name: string
    disabled?: boolean
    allowBots?: boolean
    allowDMs?: boolean
    abstract run(client: FlintClient, message: Message): Awaitable<void>
}
