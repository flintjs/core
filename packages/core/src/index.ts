export { FlintClient } from "./client/FlintClient"

export {
    FlintClientEvents,
    FlintClientEventsType,
    FlintEvents,
    ActivityType,
    StatusType,
    Activity,
    CustomStatus,
    FlintClientOptions
} from "./types"

export { type FlintCommand, defineCommand } from "./factories/command"
export { type FlintEvent, type ExtendedEvents, defineEvent } from "./factories/event"

export { BaseInhibitor } from "./inhibitors/BaseInhibitor"
export type { InhibitorResult, InhibitorType } from "./inhibitors/BaseInhibitor"
export { ok, err } from "./inhibitors/BaseInhibitor"
