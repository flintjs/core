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
    FlintClientOptions,
    FluxerClientOptions
} from "./types"
export { ILogger } from "./types/ILogger"

// factories
export { defineCommand } from "./factories/command"
export { defineListener } from "./factories/listener"

// handlers
export { BaseHandler } from "./handlers/BaseHandler"
export { CommandHandler } from "./handlers/CommandHandler"
export { ListenerHandler } from "./handlers/ListenerHandler"
export { InhibitorHandler } from "./handlers/InhibitorHandler"
export { MonitorHandler } from "./handlers/MonitorHandler"
export type { CommandHandlerOptions } from "./handlers/CommandHandler"
export type { BaseHandlerOptions } from "./handlers/BaseHandler"

// structures
export { BaseCommand as Command } from "./structures/BaseCommand"
export { BaseListener as Listener } from "./structures/BaseListener"
export { BaseInhibitor as Inhibitor } from "./structures/BaseInhibitor"
export { BaseMonitor as Monitor } from "./structures/BaseMonitor"
export { ok, err } from "./structures/BaseInhibitor"
export type { InhibitorResult, InhibitorType } from "./structures/BaseInhibitor"

// arguments
export { TypeResolver } from "./arguments/TypeResolver"
export type { TypeResolverFn } from "./arguments/TypeResolver"
export { Argument } from "./arguments/Argument"
export type { ArgumentOptions, ArgumentMatch, ArgumentType } from "./arguments/Argument"

// built-in inhibitors and monitors
export { ChannelType as ChannelTypeInhibitor } from "./structures/built-in/inhibitors/ChannelType"
export { UserPermissions as UserPermissionsInhibitor } from "./structures/built-in/inhibitors/UserPermissions"
export { BotPermissions as BotPermissionsInhibitor } from "./structures/built-in/inhibitors/BotPermissions"
export { SpamFilter as SpamFilterMonitor } from "./structures/built-in/monitors/SpamFilter"
export { Antilink as AntilinkMonitor } from "./structures/built-in/monitors/Antilink"
