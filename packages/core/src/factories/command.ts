import { CommandMeta } from "../executor/CommandContext"
import type { FlintClient } from "../client/FlintClient"
import { BaseCommand } from "../structures/BaseCommand"
import { ArgumentOptions } from "../arguments/Argument"
import { ResolveArgs } from "../arguments/types"
import type { Message } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export function defineCommand<
    TArgs extends readonly ArgumentOptions[],
    T extends Omit<BaseCommand, "execute" | "args"> & Record<string, any>
>(
    command: T & {
        args?: TArgs,
        execute(this: T, client: FlintClient, message: Message, args: ResolveArgs<TArgs>, ctx: CommandMeta): Awaitable<unknown>
    }
): T & { args?: TArgs } {
    return command
}
