import { defineCommand } from "@flint.js/core"

export default defineCommand({
    name: "ping",
    description: "Bots response time to fluxer",
    category: "Misc",
    aliases: ["pong"],
    cooldown: "5 seconds",

    async execute(client, message, args) {
        const start = Date.now()
        const replyMsg = await message.reply("Pinging...")
        const latency = Date.now() - start
        await replyMsg.edit({
            content: `Pong! Latency: ${latency}ms`
        })
    }

})
