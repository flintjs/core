import type { CommandContext } from "../../executor/CommandContext"
import { BasePrecondition, ok, err } from "../BasePrecondition"
import type { FlintCommand } from "../../factories/command"

export class ChannelTypePrecondition extends BasePrecondition {
    readonly name = "channel"

    run(command: FlintCommand, _ctx: CommandContext) {
        if (!command.allowedChannels?.length) return ok()
        const inAllowed = command.allowedChannels.includes(_ctx.message.channelId)
        return inAllowed ? ok() : err("channel")
    }
}
