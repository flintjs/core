import { defineListener, FlintClientListeners } from "@flint.js/core"
import { colors } from "@flint.js/logger"

export default defineListener({
    event: FlintClientListeners.CommandError,
    name: "commandError",
    priority: 0,

    async execute(client, { ctx, error }) {
        client.logger.error(`Command ${colors.bold(ctx.meta.command.name)} failed`, error)
    }

})
