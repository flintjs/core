import type { CommandContext } from "../../executor/CommandContext"
import type { FlintCommand } from "../../factories/command"
import { BaseInhibitor, ok, err } from "../BaseInhibitor"
import ms from "ms"

export class Cooldown extends BaseInhibitor {
    readonly name = "cooldown"

    #cooldowns = new Map<string, number>()

    parseCooldown(cooldown: FlintCommand["cooldown"]): number | null {
        let cooldownMs
        if (typeof cooldown === "number") cooldownMs = cooldown
        if (typeof cooldown === "string") cooldownMs = ms(cooldown)

        if (!cooldownMs) return null
        return cooldownMs
    }

    run(command: FlintCommand, ctx: CommandContext) {

        if (!command.cooldown) return ok()

        let cooldown = this.parseCooldown(command.cooldown)
        if (!cooldown) {
            console.warn(`[Flint] Invalid cooldown for command ${command.name}: ${command.cooldown}`)
            return ok()
        }

        const key = `${ctx.message.author.id}:${command.name}`
        const last = this.#cooldowns.get(key)
        const now = Date.now()

        if (last && now - last < cooldown) {
            const remaining = cooldown - (now - last)
            const formatted = ms(remaining, { long: true })
            return err("cooldown", { remaining, formatted })
        }

        this.#cooldowns.set(key, now)

        return ok()

    }
}
