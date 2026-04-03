import type { CommandContext } from "../executor/CommandContext"
import type { PermissionResolvable } from "@fluxerjs/core"
import type { BaseCommand } from "./BaseCommand"
import type { Awaitable } from "../types"

export type InhibitorType = "ownerOnly" | "disabled" | "channel" | "user.permissions" | "bot.permissions" | "cooldown" | "unknown"

export type InhibitorResult =
    | { ok: true }
    | { ok: false; reason: "disabled" | "channel" | "unknown" | "ownerOnly" }
    | { ok: false; reason: "user.permissions"; missing?: PermissionResolvable[] }
    | { ok: false; reason: "bot.permissions"; missing?: PermissionResolvable[] }
    | { ok: false; reason: "cooldown"; remaining?: number; formatted?: string }

type FailureReason = Extract<InhibitorResult, { ok: false }>["reason"]
type InhibitorExtra<R extends FailureReason> = R extends FailureReason
    ? Omit<Extract<InhibitorResult, { ok: false; reason: R }>, "ok" | "reason">
    : never

export const ok = (): InhibitorResult => ({ ok: true })
export const err = <R extends FailureReason>(
    reason: R,
    extra?: InhibitorExtra<R>
): InhibitorResult => ({ ok: false, reason, ...extra } as InhibitorResult)

export interface BaseInhibitorOptions {}

export abstract class BaseInhibitor {
    public readonly name: string

    constructor(name: string, options: BaseInhibitorOptions) {
        this.name = name
    }

    abstract run(command: BaseCommand, ctx: CommandContext): Awaitable<InhibitorResult>
}
