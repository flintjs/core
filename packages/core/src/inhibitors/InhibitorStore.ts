import type { BaseInhibitor, InhibitorResult } from "./BaseInhibitor"
import type { CommandContext } from "../executor/CommandContext"
import { UserPermissions } from "./built-in/UserPermissions"
import { BotPermissions } from "./built-in/BotPermissions"
import type { FlintCommand } from "../factories/command"
import { ChannelType } from "./built-in/ChannelType"
import { Disabled } from "./built-in/Disabled"
import { Cooldown } from "./built-in/Cooldown"

export class InhibitorStore {

    #inhibitors: BaseInhibitor[] = [
        new Disabled(),
        new ChannelType(),
        new UserPermissions(),
        new BotPermissions(),
        new Cooldown()
    ]

    register(inhibitors: BaseInhibitor): void {
        this.#inhibitors.push(inhibitors)
    }

    async run(command: FlintCommand, ctx: CommandContext): Promise<InhibitorResult> {
        for (const inhibitor of this.#inhibitors) {
            const result = await inhibitor.run(command, ctx)
            if (!result.ok) return result
        }
        return { ok: true }
    }

}
