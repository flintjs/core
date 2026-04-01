import { defineListener } from "@flint.js/core"
import { colors } from "@flint.js/logger"
import { Events } from "@fluxerjs/core"

export default defineListener({
    event: Events.Ready,
    name: "ready",
    once: true,
    priority: 0,

    async execute(client) {
        client.logger.info(`Logged in as ${colors.bold(client.user!.username)}`)
    }

})
