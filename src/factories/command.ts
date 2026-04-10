import { CommandMeta } from "../executor/CommandContext.js"
import type { FlintClient } from "../client/FlintClient.js"
import { BaseCommand } from "../structures/BaseCommand.js"
import { ArgumentOptions } from "../arguments/Argument.js"
import { ResolveArgs } from "../arguments/types.js"
import type { Awaitable } from "../types/index.js"
import type { Message } from "@fluxerjs/core"

export function defineCommand<
    TClient extends FlintClient = FlintClient,
    TArgs extends readonly ArgumentOptions[] = readonly ArgumentOptions[],
    T extends Omit<BaseCommand, "execute" | "args"> & Record<string, any> = Omit<BaseCommand, "execute" | "args"> & Record<string, any>
>(
    command: T & {
        args?: TArgs
        execute(this: T, client: TClient, message: Message, args: ResolveArgs<TArgs>, ctx: CommandMeta): Awaitable<unknown>
    }
): T & { args?: TArgs } {
    return command as T & { args?: TArgs }
}
