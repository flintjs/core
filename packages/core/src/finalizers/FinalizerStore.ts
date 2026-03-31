import { CommandContext } from "../executor/CommandContext"
import { FlintClient } from "../client/FlintClient"
import { BaseFinalizer } from "./BaseFinalizer"

export class FinalizerStore {

    #finalizers: BaseFinalizer[] = []

    register(finalizer: BaseFinalizer): void {
        this.#finalizers.push(finalizer)
    }

    async run(client: FlintClient, ctx: CommandContext): Promise<void> {
        for (const finalizer of this.#finalizers) {
            if (finalizer.disabled) continue
            await finalizer.run(client, ctx)
        }
    }
}
