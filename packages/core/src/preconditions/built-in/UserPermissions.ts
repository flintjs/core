import type { CommandContext } from "../../executor/CommandContext"
import { BasePrecondition, ok, err } from "../BasePrecondition"
import type { FlintCommand } from "../../factories/command"
import { PermissionsBitField } from "@fluxerjs/core"

export class UserPermissionsPrecondition extends BasePrecondition {
    readonly name = "user.permissions"

    async run(command: FlintCommand, ctx: CommandContext) {
        if (!command.permissions?.length) return ok()

        if (!ctx.message.guildId) return err("user.permissions")

        const guild = ctx.client.guilds.get(ctx.message.guildId) ?? await ctx.client.guilds.fetch(ctx.message.guildId)

        if (!guild) return err("user.permissions")

        const member = guild.members.get(ctx.message.author.id) ?? await guild.fetchMember(ctx.message.author.id)

        if (!member) return err("user.permissions")

        const missing = command.permissions
            .filter((p) => !member.permissions.has(p))
            .map((p) => new PermissionsBitField(p).toArray())
        return missing?.length ? err("user.permissions", undefined, missing) : ok()
    }
}
