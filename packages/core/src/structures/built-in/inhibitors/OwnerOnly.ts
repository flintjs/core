import type { CommandContext } from "../../../executor/CommandContext"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor"
import type { BaseCommand } from "../../BaseCommand"
import { log } from "../../../utils/logger"

export class OwnerOnly extends BaseInhibitor {

    constructor() {
        super("ownerOnly", {})
    }

    run(command: BaseCommand, _ctx: CommandContext) {

        console.log(command)

        if (!command.ownerOnly) return ok()

        if (!_ctx.client.owners?.length) {
            log("warn", `Failed ${command.name} due to 'owners' client option empty or missing.`)
            return err("ownerOnly")
        }
        if (!_ctx.client.owners.includes(_ctx.message.author.id)) return err("ownerOnly")

        return ok()

    }

}
