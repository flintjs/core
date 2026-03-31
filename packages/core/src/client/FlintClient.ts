import { default as commandExecutor } from "../executor/CommandExecutor"
import type { HandlerLoadResult, FlintClientOptions } from "../types"
import { InhibitorStore } from "../inhibitors/InhibitorStore"
import { FinalizerStore } from "../finalizers/FinalizerStore"
import { CommandHandler } from "../handlers/CommandHandler"
import { EventHandler } from "../handlers/EventHandler"
import { MonitorStore } from "../monitors/MonitorStore"
import { Client } from "@fluxerjs/core"

export class FlintClient extends Client {
    public readonly flintCommands: CommandHandler
    public readonly flintEvents: EventHandler
    public readonly inhibitors: InhibitorStore
    public readonly finalizers: FinalizerStore
    public readonly monitors: MonitorStore

    public readonly prefix?: string
    public readonly mentionPrefix?: boolean

    #options: FlintClientOptions
    #started = false

    public constructor(public readonly options: FlintClientOptions = {}) {
        super()
        this.#options = options

        this.flintCommands = new CommandHandler(this, this.#options.handlers?.commands)
        this.flintEvents = new EventHandler(this, this.#options.handlers?.events)
        this.inhibitors = new InhibitorStore()
        this.finalizers = new FinalizerStore()
        this.monitors = new MonitorStore()

        this.prefix = this.#options.prefix
        this.mentionPrefix = this.#options.mentionPrefix
    }

    public override async login(token: string): Promise<string> {
        if (this.#started) {
            throw new Error("[Flint] .start() has already been called")
        }
        this.#started = true

        const [commandResult, eventResult] = await Promise.all([
            this.flintCommands.loadAll(),
            this.flintEvents.loadAll()
        ])

        this.flintEvents.registerInternal(commandExecutor)

        this.#logLoadResult("commands", commandResult)
        this.#logLoadResult("events", eventResult)

        return await super.login(token)
    }

    public override async destroy(): Promise<void> {
        await super.destroy()
    }

    #logLoadResult(kind: string, result: HandlerLoadResult): void {
        if (result.loaded.length) {
            console.log(`[Flint] Loaded ${result.loaded.length} ${kind}`)
        }

        for (const { path, error } of result.failed) {
            console.error(`[Flint] Failed to load ${kind} from ${path}`, error)
        }
    }
}
