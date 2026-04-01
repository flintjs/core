import { CommandMeta } from "../executor/CommandContext"
import type { FlintClient } from "../client/FlintClient"
import { BaseCommand } from "../structures/BaseCommand"
import type { Message } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export function defineCommand<T extends Omit<BaseCommand, "execute"> & Record<string, any>>(
    command: T & {
        execute(this: T, client: FlintClient, message: Message, args: string[], ctx: CommandMeta): Awaitable<unknown>
    }
): T {
    return command
}
