import type { ArgumentOptions } from "../arguments/Argument.js"
import { Message, PermissionResolvable } from "@fluxerjs/core"
import { CommandMeta } from "../executor/CommandContext.js"
import { FlintClient } from "../client/FlintClient.js"
import { ResolveArgs } from "../arguments/types.js"
import { Awaitable } from "../types/index.js"
import { StringValue } from "ms"

export interface BaseCommandOptions<K> {
    description: string
    category?: string
    aliases?: string[]
    ownerOnly?: boolean
    cooldown?: number | StringValue
    permissions?: PermissionResolvable[]
    allowedChannels?: string[]
    disabled?: boolean
    prefixes?: string[]
    args?: K
}

export abstract class BaseCommand<
    TClient extends FlintClient = FlintClient,
    TArgs extends readonly ArgumentOptions[] = readonly ArgumentOptions[]
> {

    public readonly name: string
    public readonly description: string
    public readonly category?: string
    public readonly aliases?: string[]
    public readonly ownerOnly?: boolean
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
        this.ownerOnly = options.ownerOnly ?? false
        this.cooldown = options.cooldown
        this.permissions = options.permissions
        this.allowedChannels = options.allowedChannels
        this.disabled = options.disabled ?? false
        this.prefixes = options.prefixes ?? []
        this.args = options.args
    }

    abstract execute(client: TClient, message: Message, args: ResolveArgs<TArgs>, ctx: CommandMeta): Awaitable<unknown>
}
