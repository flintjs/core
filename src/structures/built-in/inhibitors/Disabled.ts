import type { CommandContext } from "../../../executor/CommandContext.js"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor.js"
import type { BaseCommand } from "../../BaseCommand.js"

export class Disabled extends BaseInhibitor {

    constructor() {
        super("disabled", {})
    }

    run(command: BaseCommand, _ctx: CommandContext) {
        return command.disabled ? err("disabled") : ok()
    }

}
