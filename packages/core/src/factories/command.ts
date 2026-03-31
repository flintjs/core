import type { Message, PermissionResolvable } from "@fluxerjs/core"
import { CommandMeta } from "../executor/CommandContext"
import type { FlintClient } from "../client/FlintClient"
import type { Awaitable } from "../types"

export interface FlintCommand {
    name: string
    description: string
    category?: string
    aliases?: string[]
    allowedChannels?: string[]
    prefixes?: string[]
    disabled?: boolean
    permissions?: PermissionResolvable[]
    execute(client: FlintClient, message: Message, args: string[], ctx: CommandMeta): Awaitable<unknown>
}

export function defineCommand<T extends Omit<FlintCommand, "execute"> & Record<string, any>>(
    command: T & {
        execute(this: T, client: FlintClient, message: Message, args: string[], ctx: CommandMeta): Awaitable<unknown>
    }
): T {
    return command
}
