import { PermissionResolvable, PermissionsBitField } from "@fluxerjs/core"
import { BaseHandler, BaseHandlerOptions } from "./BaseHandler.js"
import { ArgumentRunner } from "../arguments/ArgumentRunner.js"
import { TypeResolver } from "../arguments/TypeResolver.js"
import { BaseCommand } from "../structures/BaseCommand.js"
import { InhibitorHandler } from "./InhibitorHandler.js"
import { FlintClient } from "../client/FlintClient.js"
import { ListenerHandler } from "./ListenerHandler.js"
import { MonitorHandler } from "./MonitorHandler.js"

export interface CommandHandlerOptions extends BaseHandlerOptions {
    prefix: string
    mentionPrefix?: boolean
}

export class CommandHandler extends BaseHandler<BaseCommand> {

    prefix: string
    mentionPrefix: boolean

    resolver: TypeResolver

    #argumentRunner: ArgumentRunner
    #inhibitorHandler?: InhibitorHandler
    #listenerHandler?: ListenerHandler
    #monitorHandler?: MonitorHandler

    constructor(client: FlintClient, options: CommandHandlerOptions) {
        super(client, options)
        this.prefix = options?.prefix
        this.mentionPrefix = options.mentionPrefix ?? false
        this.resolver = new TypeResolver(client)
        this.#argumentRunner = new ArgumentRunner(this.resolver)
    }

    getCommand(name: string): BaseCommand | undefined {
        return this.get(name)
    }

    getCommandByAlias(alias: string): BaseCommand | undefined {
        return Array.from(this.store.values()).find((c) => c.aliases?.includes(alias)) ?? undefined
    }

    useInhibitorHandler(handler: InhibitorHandler): this {
        this.#inhibitorHandler = handler
        return this
    }

    useMonitorHandler(handler: MonitorHandler): this {
        this.#monitorHandler = handler
        return this
    }

    useListenerHandler(handler: ListenerHandler): this {
        this.#listenerHandler = handler
        return this
    }

    getInhibitorHandler(): InhibitorHandler | undefined {
        return this.#inhibitorHandler
    }

    getListenerHandler(): ListenerHandler | undefined {
        return this.#listenerHandler
    }

    getMonitorHandler(): MonitorHandler | undefined {
        return this.#monitorHandler
    }

    getArgumentRunner(): ArgumentRunner {
        return this.#argumentRunner
    }

    resolveCommandPermissions(permissions?: PermissionResolvable[]) {
        return permissions?.length
            ? permissions.map((p) => new PermissionsBitField(p).toArray())
            : []
    }

    getCommandUsage(command: BaseCommand) {
        let args = []
        args.push(command.name)

        for (const arg of command.args ?? []) {
            const rest = arg.match === "rest"
            if (arg.flag?.length) continue
            if (arg?.required === false) {
                args.push(`[${arg.id}${rest ? "..." : ""}]`)
            } else {
                args.push(`<${arg.id}${rest ? "..." : ""}>`)
            }
        }

        return {
            usage: args.join(" "),
            flags: (command.args ?? []).filter((a) => a.match === "flag").map((a) => `--${a.id}`) ?? [],
            options: (command.args ?? []).filter((a) => a.match === "option").map((a) => `--${a.id}=${a.type}`) ?? [],
        }
    }

}
