import { BaseProvider } from "../structures/BaseProvider.js"

export class MemoryProvider extends BaseProvider {

    #store = new Map<string, unknown>()

    async get<T = unknown>(key: string): Promise<T | null> {
        return (this.#store.get(key) ?? null) as T
    }

    async set<T = unknown>(key: string, value: T): Promise<void> {
        this.#store.set(key, value)
    }

    async delete(key: string): Promise<void> {
        this.#store.delete(key)
    }

    async has(key: string): Promise<boolean> {
        return this.#store.has(key)
    }

    async clear(): Promise<void> {
        this.#store.clear()
    }

    async keys(): Promise<string[]> {
        return [...this.#store.keys()]
    }

}
