import type { HandlerOptions, HandlerLoadResult, Awaitable } from "../types"
import { ExtendedEvents, FlintEvent } from "../factories/event"
import type { FlintClient } from "../client/FlintClient"
import { importFile, scanFolder } from "./BaseHandler"

export class EventHandler {

    private client: FlintClient
    private options?: HandlerOptions
    private flintEvents: any[] = []

    constructor(client: FlintClient, options?: HandlerOptions) {
        this.client = client
        this.options = options
    }

    public registerInternal(evt: FlintEvent<keyof ExtendedEvents>): void {
        const method = evt.once ? "once" : "on"
        this.client[method](evt.event as never, (...args: unknown[]) => {
            (evt.execute as (...args: unknown[]) => Awaitable<void>)(this.client, ...args)
        })
    }

    public async loadAll(): Promise<HandlerLoadResult> {

        const loaded: string[] = []
        const failed: HandlerLoadResult["failed"] = []

        if (!this.options?.paths?.length) return { loaded, failed }

        for (const folder of this.options.paths) {
            const files = scanFolder(folder, this.options.recursive)
            for (const file of files) {
                try {
                    const evt = await importFile(file)
                    if (!evt?.execute || !evt.name || !evt.event) {
                        throw new Error("Invalid event format")
                    }

                    const method = evt.once ? "once" : "on"
                    this.client[method](evt.event, (...args: any[]) => evt.execute(this.client, ...args))

                    loaded.push(file)
                } catch (error) {
                    failed.push({ path: file, error: error as Error })
                }
            }
        }

        return { loaded, failed }

    }

    public getAllEvents() {
        return this.flintEvents
    }

}
