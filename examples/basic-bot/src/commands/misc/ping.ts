import { defineCommand } from "@flint.js/core"
import { ExampleBotClient } from "../../"
import ms from "ms"

export default defineCommand({
    name: "ping",
    description: "Bots response time to fluxer",
    category: "Misc",
    aliases: ["pong"],
    cooldown: "5 seconds",

    async execute(client: ExampleBotClient, message, args) {
        const start = Date.now()
        const replyMsg = await message.reply(client.i18n.t("PINGING"))
        const latency = Date.now() - start
        await replyMsg.edit({
            content: `🏓 ${ms(latency, { long: true })}`
        })
    }

})
