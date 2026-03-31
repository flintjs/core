import type { CommandContext } from "../../executor/CommandContext"
import type { FlintCommand } from "../../factories/command"
import { BaseInhibitor, ok, err } from "../BaseInhibitor"

export class ChannelType extends BaseInhibitor {
    readonly name = "channel"

    run(command: FlintCommand, _ctx: CommandContext) {
        if (!command.allowedChannels?.length) return ok()
        const inAllowed = command.allowedChannels.includes(_ctx.message.channelId)
        return inAllowed ? ok() : err("channel")
    }
}
