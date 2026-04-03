import { BaseProvider } from "../structures/BaseProvider"
import fs from "node:fs"

export interface JSONProviderOptions {
    file: string
    saveDelay?: number
}

export class JSONProvider extends BaseProvider {

    #store = new Map<string, unknown>()
    #file: string
    #saveDelay: number
    #saveTimeout: NodeJS.Timeout | null = null

    constructor(options: JSONProviderOptions) {
        super()
        this.#file = options.file
        this.#saveDelay = options.saveDelay ?? 100
    }

    override async init(): Promise<void> {
        try {
            const data = JSON.parse(await fs.promises.readFile(this.#file, "utf8"))
            for (const [k, v] of Object.entries(data)) {
                this.#store.set(k, v)
            }
        } catch (error: any) {
            if (error.code === "ENOENT") {
                return await fs.promises.writeFile(this.#file, "{}", "utf8").catch(console.warn)
            }
            console.error(error)
        }
    }

    #scheduleSave(): void {
        if (this.#saveTimeout) clearTimeout(this.#saveTimeout)
        this.#saveTimeout = setTimeout(() => this.#save(), this.#saveDelay)
    }

    async #save(): Promise<void> {
        await fs.promises.writeFile(
            this.#file,
            JSON.stringify(Object.fromEntries(this.#store), null, 2)
        )
    }

    async get<T = unknown>(key: string): Promise<T | null> {
        return (this.#store.get(key) ?? null) as T
    }

    async set<T = unknown>(key: string, value: T): Promise<void> {
        this.#store.set(key, value)
        this.#scheduleSave()
    }
    async delete(key: string): Promise<void> {
        this.#store.delete(key)
        this.#scheduleSave()
    }

    async has(key: string): Promise<boolean> {
        return this.#store.has(key)
    }

    async clear(): Promise<void> {
        this.#store.clear()
        this.#scheduleSave()
    }

}
