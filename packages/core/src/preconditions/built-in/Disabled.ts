import type { CommandContext } from "../../executor/CommandContext"
import { BasePrecondition, ok, err } from "../BasePrecondition"
import type { FlintCommand } from "../../factories/command"

export class DisabledPrecondition extends BasePrecondition {
    readonly name = "disabled"

    run(command: FlintCommand, _ctx: CommandContext) {
        return command.disabled ? err("disabled") : ok()
    }

}
