import type { CommandContext } from "../../../executor/CommandContext"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor"
import type { BaseCommand } from "../../BaseCommand"
import ms from "ms"

export class Cooldown extends BaseInhibitor {

    constructor() {
        super("cooldown", {})
    }

    #cooldowns = new Map<string, number>()

    parseCooldown(cooldown: BaseCommand["cooldown"]): number | null {
        let cooldownMs
        if (typeof cooldown === "number") cooldownMs = cooldown
        if (typeof cooldown === "string") cooldownMs = ms(cooldown)

        if (!cooldownMs) return null
        return cooldownMs
    }

    run(command: BaseCommand, ctx: CommandContext) {

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
