import type { BasePrecondition, PreconditionResult } from "./BasePrecondition"
import { UserPermissionsPrecondition } from "./built-in/UserPermissions"
import { BotPermissionsPrecondition } from "./built-in/BotPermissions"
import type { CommandContext } from "../executor/CommandContext"
import { ChannelTypePrecondition } from "./built-in/ChannelType"
import { DisabledPrecondition } from "./built-in/Disabled"
import type { FlintCommand } from "../factories/command"

export class PreconditionStore {

    #preconditions: BasePrecondition[] = [
        new DisabledPrecondition(),
        new ChannelTypePrecondition(),
        new UserPermissionsPrecondition(),
        new BotPermissionsPrecondition()
    ]

    register(precondition: BasePrecondition): void {
        this.#preconditions.push(precondition)
    }

    async run(command: FlintCommand, ctx: CommandContext): Promise<PreconditionResult> {
        for (const precondition of this.#preconditions) {
            const result = await precondition.run(command, ctx)
            if (!result.ok) return result
        }
        return { ok: true }
    }

}
