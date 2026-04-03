export { FlintClient } from "./client/FlintClient.js"

// types
export {
    FlintClientListeners,
    FlintClientListenerType,
    FlintListeners,
    ActivityType,
    StatusType,
    Activity,
    CustomStatus,
    FlintClientOptions,
    FluxerClientOptions,
    Awaitable,
    CommandContext
} from "./types/index.js"
export { ILogger } from "./types/ILogger.js"

// factories
export { defineCommand } from "./factories/command.js"
export { defineListener } from "./factories/listener.js"

// handlers
export { BaseHandler } from "./handlers/BaseHandler.js"
export { CommandHandler } from "./handlers/CommandHandler.js"
export { ListenerHandler } from "./handlers/ListenerHandler.js"
export { InhibitorHandler } from "./handlers/InhibitorHandler.js"
export { MonitorHandler } from "./handlers/MonitorHandler.js"
export type { CommandHandlerOptions } from "./handlers/CommandHandler.js"
export type { BaseHandlerOptions } from "./handlers/BaseHandler.js"

// structures
export { BaseCommand as Command } from "./structures/BaseCommand.js"
export { BaseListener as Listener } from "./structures/BaseListener.js"
export { BaseInhibitor as Inhibitor } from "./structures/BaseInhibitor.js"
export { BaseMonitor as Monitor } from "./structures/BaseMonitor.js"
export { BaseProvider as Provider } from "./structures/BaseProvider.js"

export { ok, err } from "./structures/BaseInhibitor.js"
export type { InhibitorResult, InhibitorType } from "./structures/BaseInhibitor.js"

// arguments
export { TypeResolver } from "./arguments/TypeResolver.js"
export type { TypeResolverFn } from "./arguments/TypeResolver.js"
export { Argument } from "./arguments/Argument.js"
export type { ArgumentOptions, ArgumentMatch, ArgumentType } from "./arguments/Argument.js"

// built-in inhibitors and monitors
export { ChannelType as ChannelTypeInhibitor } from "./structures/built-in/inhibitors/ChannelType.js"
export { UserPermissions as UserPermissionsInhibitor } from "./structures/built-in/inhibitors/UserPermissions.js"
export { BotPermissions as BotPermissionsInhibitor } from "./structures/built-in/inhibitors/BotPermissions.js"
export { SpamFilter as SpamFilterMonitor } from "./structures/built-in/monitors/SpamFilter.js"
export { Antilink as AntilinkMonitor } from "./structures/built-in/monitors/Antilink.js"

// schedules
export { BaseSchedule as Schedule } from "./structures/BaseSchedule.js"
export { ScheduleHandler } from "./handlers/ScheduleHandler.js"
export type { ScheduledTask, ScheduleHandlerOptions } from "./handlers/ScheduleHandler.js"

// providers
export { JSONProvider } from "./providers/JSONProvider.js"
export { MemoryProvider } from "./providers/MemoryProvider.js"
