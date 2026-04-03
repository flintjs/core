import { BaseHandler, BaseHandlerOptions } from "./BaseHandler"
import type { BaseSchedule } from "../structures/BaseSchedule"
import type { BaseProvider } from "../structures/BaseProvider"
import type { FlintClient } from "../client/FlintClient"
import { JSONProvider } from "../providers/JSONProvider"
import { log } from "../utils/logger"

export interface ScheduledTask<TData = unknown> {
    id: string
    name: string
    createdAt: number
    runAt: number
    interval?: number
    repeat?: boolean
    data: TData
    missedBehaviour?: "run" | "skip"
}

export interface ScheduleHandlerOptions extends BaseHandlerOptions {
    provider?: BaseProvider
    tickInterval?: number
    defaultMissedBehaviour?: "run" | "skip"
}

type CreateOptions<TSchedules, K extends keyof TSchedules> = {
    runAt: Date
    repeat?: boolean
    missedBehaviour?: "run" | "skip"
} & (TSchedules[K] extends never ? { data?: never } : { data: TSchedules[K] })

export class ScheduleHandler<TSchedules = Record<string, never>> extends BaseHandler<BaseSchedule> {

    #provider: BaseProvider
    #tickInterval: number
    #defaultMissedBehaviour: "run" | "skip"
    #ticker?: NodeJS.Timeout

    constructor(client: FlintClient, options: ScheduleHandlerOptions) {
        super(client, options)
        this.#provider = options.provider ?? new JSONProvider({ file: "./schedules.json" })
        this.#tickInterval = options.tickInterval ?? 1000
        this.#defaultMissedBehaviour = options.defaultMissedBehaviour ?? "run"
    }

    override async loadAll(): Promise<this> {
        await super.loadAll()
        await this.#provider.init()
        await this.#handleMissed()
        this.#startTicker()
        return this
    }

    async #handleMissed(): Promise<void> {
        const now = Date.now()
        const tasks = await this.#getTasks()
        const missed = tasks.filter(t => t.runAt <= now)

        for (const task of missed) {
            const behaviour = task.missedBehaviour ?? this.#defaultMissedBehaviour
            if (behaviour === "skip") {
                tasks.splice(tasks.indexOf(task), 1)
                continue
            }
        }

        await this.#saveTasks(tasks)
    }

    async create<K extends keyof TSchedules & string>(
        name: K extends keyof TSchedules ? K : never,
        options: CreateOptions<TSchedules, K>
    ): Promise<ScheduledTask> {
        const schedule = this.store.get(name)
        if (!schedule) throw new Error(`[Flint] Schedule "${name}" has not been registered`)

        const task: ScheduledTask = {
            id: crypto.randomUUID(),
            name,
            runAt: options.runAt.getTime(),
            createdAt: Date.now(),
            interval: options.runAt.getTime() - Date.now(),
            repeat: options.repeat,
            data: options.data,
            missedBehaviour: options.missedBehaviour ?? this.#defaultMissedBehaviour
        }

        const tasks = await this.#getTasks()
        tasks.push(task)
        await this.#saveTasks(tasks)

        return task
    }

    async cancel(id: string): Promise<boolean> {
        const tasks = await this.#getTasks()
        const index = tasks.findIndex(t => t.id === id)
        if (index === -1) return false
        tasks.splice(index, 1)
        await this.#saveTasks(tasks)
        return true
    }

    async getTasks(name?: string): Promise<ScheduledTask[]> {
        const tasks = await this.#getTasks()
        return name ? tasks.filter(t => t.name === name) : tasks
    }

    #startTicker(): void {
        this.#ticker = setInterval(() => this.#tick(), this.#tickInterval)
    }

    async #tick(): Promise<void> {
        const now = Date.now()
        const tasks = await this.#getTasks()
        const due = tasks.filter(t => t.runAt <= now)

        for (const task of due) {
            const schedule = this.store.get(task.name)
            if (!schedule) continue

            try {
                await schedule.run(this.client, task)
            } catch (error) {
                log("error", `Error running scheduled task "${task.name}"`, error)
            }

            if (task.repeat && task.interval) {
                task.runAt = Date.now() + task.interval
            } else {
                tasks.splice(tasks.indexOf(task), 1)
            }
        }

        await this.#saveTasks(tasks)
    }

    async #getTasks(): Promise<ScheduledTask[]> {
        return (await this.#provider.get<ScheduledTask[]>("tasks")) ?? []
    }

    async #saveTasks(tasks: ScheduledTask[]): Promise<void> {
        await this.#provider.set("tasks", tasks)
    }

    destroy(): void {
        if (this.#ticker) clearInterval(this.#ticker)
    }

}
