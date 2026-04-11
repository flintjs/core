import type { FlintClientOptions, FluxerClientOptions } from "../types/index.js"
import { OwnerOnly } from "../structures/built-in/inhibitors/OwnerOnly.js"
import { Disabled } from "../structures/built-in/inhibitors/Disabled.js"
import { Cooldown } from "../structures/built-in/inhibitors/Cooldown.js"
import { InhibitorHandler } from "../handlers/InhibitorHandler.js"
import { ListenerHandler } from "../handlers/ListenerHandler.js"
import { CommandExecutor } from "../executor/CommandExecutor.js"
import { kInhibitors, kListeners } from "../internal/symbols.js"
import { CommandHandler } from "../handlers/CommandHandler.js"
import { MonitorHandler } from "../handlers/MonitorHandler.js"
import { setLogger } from "../utils/logger.js"
import { ILogger } from "../types/ILogger.js"
import { Client } from "@fluxerjs/core"

export class FlintClient extends Client {

    #commandHandler?: CommandHandler
    #listenerHandler?: ListenerHandler
    #inhibitorHandler?: InhibitorHandler
    #monitorHandler?: MonitorHandler
    #logger?: ILogger

    private [kInhibitors]: InhibitorHandler
    private [kListeners]: ListenerHandler

    #started = false

    owners: string[]

    public constructor(flintOptions: FlintClientOptions, public readonly fluxerOptions: FluxerClientOptions = {}) {
        super({
            ...fluxerOptions,
            intents: 0
        })
        this[kListeners] = new ListenerHandler(this, {
            directory: "",
            builtins: [new CommandExecutor()]
        })
        this[kInhibitors] = new InhibitorHandler(this, {
            directory: "",
            builtins: [
                new OwnerOnly(),
                new Disabled(),
                new Cooldown()
            ]
        })
        this.owners = flintOptions.owners
    }

    useLogger(logger: ILogger): this {
        this.#logger = logger
        setLogger(logger)
        return this
    }

    get logger(): ILogger {
        if (!this.#logger) throw new Error("[Flint] Logger not registered")
        return this.#logger
    }

    set logger(logger: ILogger) {
        this.#logger = logger
        setLogger(logger)
    }

    public override async login(token: string): Promise<string> {
        if (this.#started) {
            throw new Error("[Flint] .login() has already been called")
        }
        this.#started = true

        await this[kListeners].loadAll()
        await this[kInhibitors].loadAll()
        return await super.login(token)
    }

    public override async destroy(): Promise<void> {
        await super.destroy()
    }

    get commandHandler(): CommandHandler {
        if (!this.#commandHandler) throw new Error("[Flint] CommandHandler not registered")
        return this.#commandHandler
    }

    set commandHandler(handler: CommandHandler) {
        this.#commandHandler = handler
    }

    get listenerHandler(): ListenerHandler {
        if (!this.#listenerHandler) throw new Error("[Flint] ListenerHandler not registered")
        return this.#listenerHandler
    }

    set listenerHandler(handler: ListenerHandler) {
        this.#listenerHandler = handler
    }

    get inhibitorHandler(): InhibitorHandler {
        if (!this.#inhibitorHandler) throw new Error("[Flint] InhibitorHandler not registered")
        return this.#inhibitorHandler
    }

    set inhibitorHandler(handler: InhibitorHandler) {
        this.#inhibitorHandler = handler
    }

    get monitorHandler(): MonitorHandler {
        if (!this.#monitorHandler) throw new Error("[Flint] MonitorHandler not registered")
        return this.#monitorHandler
    }

    set monitorHandler(handler: MonitorHandler) {
        this.#monitorHandler = handler
    }

}
