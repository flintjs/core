import type { CommandContext } from "../../executor/CommandContext"
import { BaseInhibitor, ok, err } from "../BaseInhibitor"
import type { FlintCommand } from "../../factories/command"
import { PermissionsBitField } from "@fluxerjs/core"

export class BotPermissions extends BaseInhibitor {
    readonly name = "bot.permissions"

    async run(command: FlintCommand, ctx: CommandContext) {
        if (!command.permissions?.length) return ok()

        if (!ctx.message.guildId) return err("bot.permissions")

        const guild = ctx.client.guilds.get(ctx.message.guildId) ?? await ctx.client.guilds.fetch(ctx.message.guildId)

        if (!guild) return err("bot.permissions")

        const missing = command.permissions
            .filter((p) => !guild.members.me?.permissions.has(p))
            .map((p) => new PermissionsBitField(p).toArray())
        return missing?.length ? err("bot.permissions", undefined, missing) : ok()
    }
}
