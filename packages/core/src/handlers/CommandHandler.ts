import { BaseHandler, BaseHandlerOptions } from "./BaseHandler"
import { ArgumentRunner } from "../arguments/ArgumentRunner"
import { TypeResolver } from "../arguments/TypeResolver"
import { BaseCommand } from "../structures/BaseCommand"
import { InhibitorHandler } from "./InhibitorHandler"
import { FlintClient } from "../client/FlintClient"
import { ListenerHandler } from "./ListenerHandler"
import { MonitorHandler } from "./MonitorHandler"

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

}
