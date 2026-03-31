import { defineEvent } from "@flint.js/core"
import { Events } from "@fluxerjs/core"

export default defineEvent({
    event: Events.Ready,
    name: "ready",
    once: true,
    priority: 0,

    async execute(client) {
        console.log(`Logged in as ${client.user!.username}`)
    }

})
