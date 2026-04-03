import type { CommandContext } from "../../../executor/CommandContext"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor"
import type { BaseCommand } from "../../BaseCommand"

export class ChannelType extends BaseInhibitor {

    constructor() {
        super("channel", {})
    }

    run(command: BaseCommand, _ctx: CommandContext) {
        if (!command.allowedChannels?.length) return ok()
        const inAllowed = command.allowedChannels.includes(_ctx.message.channelId)
        return inAllowed ? ok() : err("channel")
    }
}
