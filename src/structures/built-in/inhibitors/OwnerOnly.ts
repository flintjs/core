import type { CommandContext } from "../../../executor/CommandContext.js"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor.js"
import type { BaseCommand } from "../../BaseCommand.js"
import { log } from "../../../utils/logger.js"

export class OwnerOnly extends BaseInhibitor {

    constructor() {
        super("ownerOnly", {})
    }

    run(command: BaseCommand, _ctx: CommandContext) {

        if (!command.ownerOnly) return ok()

        if (!_ctx.client.owners?.length) {
            log("warn", `Failed ${command.name} due to 'owners' client option empty or missing.`)
            return err("ownerOnly")
        }

        return _ctx.client.owners.includes(_ctx.message.author.id) ? ok() : err("ownerOnly")

    }

}
