import { importFile, scanFolder } from "../utils/fileUtils"
import { FlintClient } from "../client/FlintClient"
import { log, setLogger } from "../utils/logger"
import type { ILogger } from "../types/ILogger"

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
                const { isClass, isLanguage, module } = await importFile(file)

                let data = module

                if (isClass) {
                    data = new module()
                }

                if (isLanguage) {
                    if (!("language" in data)) {
                        log("warn", `File ${file} is missing the "languages" property.`)
                        continue
                    }
                } else {
                    if (!("execute" in data)) {
                        log("warn", `File ${file} is missing the "execute" property.`)
                        continue
                    }
                }

                if (!("name" in data)) {
                    log("warn", `File ${file} is missing the "name" property.`)
                    continue
                }

                this.store.set(data.name, data)
            } catch (error) {
                log("error", `Failed to load ${file}`, error)
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
