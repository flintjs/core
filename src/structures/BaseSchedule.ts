import { ScheduledTask } from "../handlers/ScheduleHandler.js"
import type { FlintClient } from "../client/FlintClient.js"
import type { Awaitable } from "../types/index.js"

export abstract class BaseSchedule<TData = unknown> {

    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    abstract run(client: FlintClient, task: ScheduledTask<TData>): Awaitable<void>

}
