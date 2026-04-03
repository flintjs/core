import { ScheduledTask } from "../handlers/ScheduleHandler"
import type { FlintClient } from "../client/FlintClient"
import type { Awaitable } from "../types"

export abstract class BaseSchedule<TData = unknown> {

    readonly name: string

    constructor(name: string) {
        this.name = name
    }

    abstract run(client: FlintClient, task: ScheduledTask<TData>): Awaitable<void>

}
