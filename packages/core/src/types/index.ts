import { InhibitorResult } from "../structures/BaseInhibitor"
import { CommandContext } from "../executor/CommandContext"
import { Message } from "@fluxerjs/core"

export type Awaitable<T> = T | Promise<T>
export type MaybeArray<T> = T | T[]
export type Constructor<T = object, Args extends any[] = any[]> = new (...args: Args) => T

export const FlintClientListeners = {
    CommandDenied: "commandDenied",
    CommandError: "commandError",
    CommandSuccess: "commandSuccess",
    CommandNotFound: "commandNotFound"
} as const

export type FlintClientListenerType = typeof FlintClientListeners[keyof typeof FlintClientListeners]

export interface FlintListeners {
    [FlintClientListeners.CommandDenied]: [payload: {
        result: InhibitorResult
        ctx: CommandContext
    }]
    [FlintClientListeners.CommandError]: [payload: {
        error: Error
        ctx: CommandContext
    }]
    [FlintClientListeners.CommandSuccess]: [payload: {
        ctx: CommandContext
    }]
    [FlintClientListeners.CommandNotFound]: [payload: {
        prefix: string
        name: string
        message: Message
    }]
}

export interface HandlerOptions {
    paths?: string[]
    recursive?: boolean
}

export interface HandlerLoadResult {
    loaded: string[]
    failed: Array<{
        path: string
        error: Error
    }>
}

export enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    COMPETING = 4
}

export enum StatusType {
    ONLINE = "online",
    IDLE = "idle",
    DND = "dnd",
    INVISIBLE = "invisible"
}

export interface Activity {
    name: string
    type: ActivityType
    url?: string | null
}

interface CustomStatusAsText {
    text?: string | null
    emoji_name?: never
    emoji_id?: never
}

interface CustomStatusAsEmoji {
    text?: string | null
    emoji_name: string | null
    emoji_id: string | null
}

export type CustomStatus = CustomStatusAsText | CustomStatusAsEmoji

export interface PresenceData {
    since?: number | null
    activities?: Activity[]
    custom_status?: CustomStatus | null
    status: StatusType
    afk?: boolean
}

export interface FlintClientOptions {
    prefix?: string
    mentionPrefix?: boolean
    intents?: 0
    presence?: PresenceData
    waitForGuilds?: boolean
    handlers?: {
        commands?: HandlerOptions
        events?: HandlerOptions
    }
}
