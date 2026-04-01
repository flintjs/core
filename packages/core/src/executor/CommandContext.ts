import type { ParseResult } from "../executor/CommandParser"
import type { BaseCommand } from "../structures/BaseCommand"
import type { FlintClient } from "../client/FlintClient"
import type { Message } from "@fluxerjs/core"

export interface CommandContext {
    client: FlintClient
    message: Message
    args: string[]
    meta: CommandMeta
}

export interface CommandMeta {
    prefix: string
    usedAlias: string | null
    command: BaseCommand
}

export function buildContext(client: FlintClient, message: Message, parsed: ParseResult, command: BaseCommand): [client: FlintClient, message: Message, args: string[], meta: CommandMeta] {
    const meta: CommandMeta = {
        prefix: parsed.prefix,
        usedAlias: parsed.commandName !== command.name ? parsed.commandName : null,
        command
    }
    return [
        client,
        message,
        parsed.args,
        meta
    ]
}

export function buildInhibitorContext(
    client: FlintClient,
    message: Message,
    parsed: ParseResult,
    command: BaseCommand
): CommandContext {
    const [c, m, args, meta] = buildContext(client, message, parsed, command)
    return { client: c, message: m, args, meta }
}
