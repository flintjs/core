import type { CommandContext } from "../executor/CommandContext"
import type { FlintCommand } from "../factories/command"
import { PermissionResolvable } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export type PreconditionType = "disabled" | "channel" | "user.permissions" | "bot.permissions" | "unknown"

export type PreconditionResult =
    | { ok: true }
    | {
        ok: false
        reason: Extract<PreconditionType, "disabled" | "channel" | "unknown">
        message?: string
    }
    | {
        ok: false
        reason: Extract<PreconditionType, "user.permissions" | "bot.permissions">
        message?: string
        missing?: PermissionResolvable[]
    }

type FailureReason = Extract<PreconditionResult, { ok: false }>["reason"]

export const ok = (): PreconditionResult => ({ ok: true })
export const err = (reason: FailureReason, message?: string, missing?: PermissionResolvable[]): PreconditionResult => ({ ok: false, reason, message, missing })

export abstract class BasePrecondition {
    abstract name: string
    abstract run(command: FlintCommand, ctx: CommandContext): Awaitable<PreconditionResult>
}
