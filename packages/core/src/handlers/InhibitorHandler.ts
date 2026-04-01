import type { CommandContext } from "../executor/CommandContext"
import { InhibitorResult } from "../structures/BaseInhibitor"
import type { BaseCommand } from "../structures/BaseCommand"
import { BaseInhibitor } from "../structures/BaseInhibitor"
import { BaseHandler } from "./BaseHandler"

export class InhibitorHandler extends BaseHandler<BaseInhibitor> {

    register(inhibitor: BaseInhibitor): this {
        this.store.set(inhibitor.name, inhibitor)
        return this
    }

    async run(command: BaseCommand, ctx: CommandContext): Promise<InhibitorResult> {
        for (const inhibitor of this.store.values()) {
            const result = await inhibitor.run(command, ctx)
            if (!result.ok) return result
        }
        return { ok: true }
    }

}
