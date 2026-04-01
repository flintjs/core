import type { CommandContext } from "../../../executor/CommandContext"
import { BaseInhibitor, ok, err } from "../../BaseInhibitor"
import type { BaseCommand } from "../../BaseCommand"

export class Disabled extends BaseInhibitor {

    constructor() {
        super("disabled", {})
    }

    run(command: BaseCommand, _ctx: CommandContext) {
        return command.disabled ? err("disabled") : ok()
    }

}
