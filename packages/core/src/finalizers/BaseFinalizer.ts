import { CommandContext } from "../executor/CommandContext"
import { FlintClient } from "../client/FlintClient"
import { Awaitable } from "../types"

export abstract class BaseFinalizer {
    abstract name: string
    disabled?: boolean
    abstract run(client: FlintClient, ctx: CommandContext): Awaitable<void>
}
