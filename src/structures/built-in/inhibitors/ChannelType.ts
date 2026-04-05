import type { CommandContext } from "../../../executor/CommandContext.js"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor.js"
import type { BaseCommand } from "../../BaseCommand.js"

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
