import type { CommandContext } from "../executor/CommandContext"
import type { FlintCommand } from "../factories/command"
import { PermissionResolvable } from "@fluxerjs/core"
import type { Awaitable } from "../types"

export type InhibitorType = "disabled" | "channel" | "user.permissions" | "bot.permissions" | "unknown"

export type InhibitorResult =
    | { ok: true }
    | { ok: false; reason: "disabled" | "channel" | "unknown" }
    | { ok: false; reason: "user.permissions"; missing?: PermissionResolvable[] }
    | { ok: false; reason: "bot.permissions"; missing?: PermissionResolvable[] }
    | { ok: false; reason: "cooldown"; remaining?: number; formatted?: string }

type InhibitorExtra<R extends FailureReason> = R extends FailureReason
    ? Omit<Extract<InhibitorResult, { ok: false; reason: R }>, "ok" | "reason">
    : never

type FailureReason = Extract<InhibitorResult, { ok: false }>["reason"]

export const ok = (): InhibitorResult => ({ ok: true })

export const err = <R extends FailureReason>(
    reason: R,
    extra?: InhibitorExtra<R>
): InhibitorResult => ({ ok: false, reason, ...extra } as InhibitorResult)

export abstract class BaseInhibitor {
    abstract name: string
    abstract run(command: FlintCommand, ctx: CommandContext): Awaitable<InhibitorResult>
}
