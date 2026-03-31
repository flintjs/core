import type { CommandContext } from "../../executor/CommandContext"
import type { FlintCommand } from "../../factories/command"
import { BaseInhibitor, ok, err } from "../BaseInhibitor"
import ms from "ms"
import { Message } from "@fluxerjs/core"

export class Cooldown extends BaseInhibitor {
    readonly name = "cooldown"
    cooldowns: WeakMap<FlintCommand, number>

    constructor(public readonly seconds: number) {
        super()
        this.cooldowns = new WeakMap()
    }

    parseCooldown(cooldown: FlintCommand["cooldown"]): number | null {
        let cooldownMs
        if (typeof cooldown === "number") cooldownMs = cooldown
        if (typeof cooldown === "string") cooldownMs = ms(cooldown)

        if (!cooldownMs) return null
        return cooldownMs
    }

    getCooldown(message: Message, command: FlintCommand): number | null {
        let cooldown = this.cooldowns.get(command)
        return 0
    }

    run(command: FlintCommand, ctx: CommandContext) {

        if (!command.cooldown) return ok()

        let cooldown = this.parseCooldown(command.cooldown)
        if (!cooldown) {
            console.warn(`[Flint] Invalid cooldown for command ${command.name}: ${command.cooldown}`)
            return ok()
        }

        return ok()

        // if (!command.allowedChannels?.length) return ok()
        // const inAllowed = command.allowedChannels.includes(ctx.message.channelId)
        // return inAllowed ? ok() : err("channel")



    }
}
