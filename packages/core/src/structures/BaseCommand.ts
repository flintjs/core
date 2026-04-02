import { Message, PermissionResolvable } from "@fluxerjs/core"
import type { ArgumentOptions } from "../arguments/Argument"
import { CommandMeta } from "../executor/CommandContext"
import { FlintClient } from "../client/FlintClient"
import { ResolveArgs } from "../arguments/types"
import { Awaitable } from "../types"
import { StringValue } from "ms"

export interface BaseCommandOptions<K> {
    description: string
    category?: string
    aliases?: string[]
    cooldown?: number | StringValue
    permissions?: PermissionResolvable[]
    allowedChannels?: string[]
    disabled?: boolean
    prefixes?: string[]
    args?: K
}

export abstract class BaseCommand<TArgs extends readonly ArgumentOptions[] = readonly ArgumentOptions[]> {

    public readonly name: string
    public readonly description: string
    public readonly category?: string
    public readonly aliases?: string[]
    public readonly cooldown?: number | StringValue
    public readonly permissions?: PermissionResolvable[]
    public readonly allowedChannels?: string[]
    public readonly disabled?: boolean
    public readonly prefixes?: string[]
    readonly args?: TArgs

    constructor(name: string, options: BaseCommandOptions<TArgs>) {
        this.name = name
        this.description = options.description
        this.category = options.category ?? "Uncategorized"
        this.aliases = options.aliases ?? []
        this.cooldown = options.cooldown
        this.permissions = options.permissions
        this.allowedChannels = options.allowedChannels
        this.disabled = options.disabled ?? false
        this.prefixes = options.prefixes ?? []
        this.args = options.args
    }

    abstract execute(client: FlintClient, message: Message, args: ResolveArgs<TArgs>, ctx: CommandMeta): Awaitable<unknown>
}
