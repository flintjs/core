import type { CommandContext } from "../../executor/CommandContext"
import type { FlintCommand } from "../../factories/command"
import { BaseInhibitor, ok, err } from "../BaseInhibitor"

export class Disabled extends BaseInhibitor {
    readonly name = "disabled"

    run(command: FlintCommand, _ctx: CommandContext) {
        return command.disabled ? err("disabled") : ok()
    }

}
