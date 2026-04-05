import type { CommandContext } from "../../../executor/CommandContext.js"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor.js"
import type { BaseCommand } from "../../BaseCommand.js"
import { PermissionsBitField } from "@fluxerjs/core"

export class BotPermissions extends BaseInhibitor {

    constructor() {
        super("bot.permissions", {})
    }

    async run(command: BaseCommand, ctx: CommandContext) {
        if (!command.permissions?.length) return ok()

        if (!ctx.message.guildId) return err("bot.permissions")

        const guild = ctx.client.guilds.get(ctx.message.guildId) ?? await ctx.client.guilds.fetch(ctx.message.guildId)

        if (!guild) return err("bot.permissions")

        const missing = command.permissions
            .filter((p) => !guild.members.me?.permissions.has(p))
            .map((p) => new PermissionsBitField(p).toArray())
        return missing?.length ? err("bot.permissions", { missing }) : ok()
    }
}
