import { importFile, scanFolder } from "../utils/fileUtils.js"
import { FlintClient } from "../client/FlintClient.js"
import { log, setLogger } from "../utils/logger.js"
import type { ILogger } from "../types/ILogger.js"
import { isFunction } from "@flint.js/utils"

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
                const { type, isClass, module } = await importFile(file)

                let data = module

                if (isClass) {
                    data = new module()
                }

                if (!("name" in data)) {
                    log("warn", `File ${file} is missing the "name" property.`)
                    continue
                }

                switch(type) {
                    case "language": {
                        if (!data.language) {
                            log("warn", `Language ${module.name} is missing the "language" property.`)
                            continue
                        }
                        break
                    }
                    case "schedule": {
                        if (!isFunction(data?.run)) {
                            log("warn", `Schedule ${module.name} is missing the "run" property.`)
                            continue
                        }
                        break
                    }
                    case "other": {
                        if (!isFunction(data?.execute)) {
                            log("warn", `File ${module.name} is missing the "execute" property.`)
                            continue
                        }
                        break
                    }
                    default: {
                        log("warn", `File ${file} os of unknown type. Make sure it is defined properly.`)
                        continue
                    }
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
