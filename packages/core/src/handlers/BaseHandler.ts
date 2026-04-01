import { importFile, isClass, scanFolder } from "../utils/fileUtils"
import { FlintClient } from "../client/FlintClient"
import type { ILogger } from "../types/ILogger"
import { setLogger } from "../utils/logger"

export interface BaseHandlerOptions {
    directory: string
    recursive?: boolean
}

export abstract class BaseHandler<T extends { name: string }> {

    protected client: FlintClient
    protected directory: string
    protected recursive: boolean
    protected store: Map<string, T> = new Map()

    #logger?: ILogger

    constructor(client: FlintClient, options: BaseHandlerOptions & { builtins?: T[] }) {
        this.client = client
        this.directory = options.directory
        this.recursive = options.recursive ?? true
        for (const builtin of options.builtins ?? []) {
            this.store.set(builtin.name, builtin)
        }
    }

    useLogger(logger: ILogger): this {
        this.#logger = logger
        setLogger(logger)
        return this
    }

    async loadAll(): Promise<this> {
        if (!this.directory) return this

        const files = scanFolder(this.directory, this.recursive)

        for (const file of files) {
            try {
                const imported = await importFile(file)

                let data = imported

                if (isClass(imported)) {
                    data = new imported()
                }

                if (!("name" in data)) {
                    this.#logger?.warn(`File ${file} is missing the "name" property.`)
                    continue
                }

                if (!("execute" in data)) {
                    this.#logger?.warn(`File ${file} is missing the "execute" property.`)
                    continue
                }

                this.store.set(data.name, data)
            } catch (error) {
                this.#logger?.error(`Failed to load ${file}`, error)
            }
        }

        return this
    }

    get(name: string): T | undefined {
        return this.store.get(name)
    }

    getAll(): T[] {
        return Array.from(this.store.values())
    }

}
