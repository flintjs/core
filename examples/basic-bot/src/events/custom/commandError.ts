import { defineEvent, FlintClientEvents } from "@flint.js/core"

export default defineEvent({
    event: FlintClientEvents.CommandError,
    name: "commandError",
    priority: 0,

    async execute(client, { ctx, error }) {
        console.log(`[TestBot] Command ${ctx.meta.command.name} failed`, error)
    }

})
