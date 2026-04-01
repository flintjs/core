export { FlintClient } from "./client/FlintClient"

// types
export {
    FlintClientListeners,
    FlintClientListenerType,
    FlintListeners,
    ActivityType,
    StatusType,
    Activity,
    CustomStatus,
    FlintClientOptions
} from "./types"
export { ILogger } from "./types/ILogger"

// factories
export { defineCommand } from "./factories/command"
export { defineListener } from "./factories/listener"

// handlers
export { CommandHandler } from "./handlers/CommandHandler"
export { ListenerHandler } from "./handlers/ListenerHandler"
export { InhibitorHandler } from "./handlers/InhibitorHandler"
export { MonitorHandler } from "./handlers/MonitorHandler"
export type { CommandHandlerOptions } from "./handlers/CommandHandler"
export type { BaseHandlerOptions } from "./handlers/BaseHandler"

// structures
export { BaseCommand } from "./structures/BaseCommand"
export { BaseListener } from "./structures/BaseListener"
export { BaseInhibitor } from "./structures/BaseInhibitor"
export { BaseMonitor } from "./structures/BaseMonitor"
export { ok, err } from "./structures/BaseInhibitor"
export type { InhibitorResult, InhibitorType } from "./structures/BaseInhibitor"

// built-in inhibitors and monitors
export { Disabled } from "./structures/built-in/inhibitors/Disabled"
export { ChannelType } from "./structures/built-in/inhibitors/ChannelType"
export { UserPermissions } from "./structures/built-in/inhibitors/UserPermissions"
export { BotPermissions } from "./structures/built-in/inhibitors/BotPermissions"
export { SpamFilter } from "./structures/built-in/monitors/SpamFilter"
export { Antilink } from "./structures/built-in/monitors/Antilink"
