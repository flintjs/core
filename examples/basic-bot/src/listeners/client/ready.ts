import { defineListener } from "@flint.js/core"
import { ExampleBotClient } from "../../index"
import { colors } from "@flint.js/logger"
import { Events } from "@fluxerjs/core"

export default defineListener({
    event: Events.Ready,
    name: "ready",
    once: true,
    priority: 0,

    async execute(client: ExampleBotClient) {
        client.logger.info(client.i18n.t("CLIENT_READY", { username: colors.bold(client.user!.username) }))
    }

})
