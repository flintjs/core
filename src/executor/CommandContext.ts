import type { ParseResult } from "../executor/CommandParser.js"
import type { BaseCommand } from "../structures/BaseCommand.js"
import type { FlintClient } from "../client/FlintClient.js"
import type { Message } from "@fluxerjs/core"

export interface CommandContext {
    client: FlintClient
    message: Message
    args: Record<string, unknown>
    meta: CommandMeta
}

export interface CommandMeta {
    prefix: string
    usedAlias: string | null
    command: BaseCommand
}

export function buildContext(
    client: FlintClient,
    message: Message,
    parsed: ParseResult,
    parsedArgs: Record<string, unknown>,
    command: BaseCommand
): [client: FlintClient, message: Message, args: Record<string, unknown>, meta: CommandMeta] {
    const meta: CommandMeta = {
        prefix: parsed.prefix,
        usedAlias: parsed.commandName !== command.name ? parsed.commandName : null,
        command
    }
    return [client, message, parsedArgs, meta]
}

export function buildInhibitorContext(
    client: FlintClient,
    message: Message,
    parsed: ParseResult,
    command: BaseCommand
): CommandContext {
    return { client, message, args: {}, meta: { prefix: parsed.prefix, usedAlias: null, command } }
}
