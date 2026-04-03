export abstract class BaseProvider {

    async init(): Promise<void> {}

    abstract get<T = unknown>(key: string): Promise<T | null>
    abstract set<T = unknown>(key: string, value: T): Promise<void>
    abstract delete(key: string): Promise<void>
    abstract has(key: string): Promise<boolean>
    abstract clear(): Promise<void>

}
