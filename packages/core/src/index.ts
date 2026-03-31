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

export { BasePrecondition } from "./preconditions/BasePrecondition"
export type { PreconditionResult, PreconditionType } from "./preconditions/BasePrecondition"
export { ok, err } from "./preconditions/BasePrecondition"
