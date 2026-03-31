import type { CommandContext } from "../executor/CommandContext"
import type { FlintCommand } from "../factories/command"
import { PermissionResolvable } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export type InhibitorType = "disabled" | "channel" | "user.permissions" | "bot.permissions" | "unknown"

export type InhibitorResult =
    | { ok: true }
    | {
        ok: false
        reason: Extract<InhibitorType, "disabled" | "channel" | "unknown">
        message?: string
    }
    | {
        ok: false
        reason: Extract<InhibitorType, "user.permissions" | "bot.permissions">
        message?: string
        missing?: PermissionResolvable[]
    }

type FailureReason = Extract<InhibitorResult, { ok: false }>["reason"]

export const ok = (): InhibitorResult => ({ ok: true })
export const err = (reason: FailureReason, message?: string, missing?: PermissionResolvable[]): InhibitorResult => ({ ok: false, reason, message, missing })

export abstract class BaseInhibitor {
    abstract name: string
    abstract run(command: FlintCommand, ctx: CommandContext): Awaitable<InhibitorResult>
}
