import { Message, PermissionResolvable } from "@fluxerjs/core"
import { CommandMeta } from "../executor/CommandContext"
import { FlintClient } from "../client/FlintClient"
import { Awaitable } from "../types"
import { StringValue } from "ms"

interface BaseCommandOptions {
    name: string
    description: string
    category?: string
    aliases?: string[]
    cooldown?: number | StringValue
    permissions?: PermissionResolvable[]
    allowedChannels?: string[]
    disabled?: boolean
    prefixes?: string[]
}

export abstract class BaseCommand {

    public readonly name: string
    public readonly description: string
    public readonly category?: string
    public readonly aliases?: string[]
    public readonly cooldown?: number | StringValue
    public readonly permissions?: PermissionResolvable[]
    public readonly allowedChannels?: string[]
    public readonly disabled?: boolean
    public readonly prefixes?: string[]

    constructor(options: BaseCommandOptions) {
        this.name = options.name
        this.description = options.description
        this.category = options.category ?? "Uncategorized"
        this.aliases = options.aliases ?? []
        this.cooldown = options.cooldown
        this.permissions = options.permissions
        this.allowedChannels = options.allowedChannels
        this.disabled = options.disabled ?? false
        this.prefixes = options.prefixes ?? []
    }

    abstract execute(client: FlintClient, message: Message, args: string[], ctx: CommandMeta): Awaitable<unknown>
}
