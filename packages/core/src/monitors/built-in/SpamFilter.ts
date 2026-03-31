import { FlintClient } from "../../client/FlintClient"
import { BaseMonitor } from "../BaseMonitor"
import { Message } from "@fluxerjs/core"

export class SpamFilter extends BaseMonitor {
    readonly name = "spamFilter"
    allowBots = false
    allowDMs = false

    #messageCount = new Map<String, number>()
    #sentWarning = new Map<String, boolean>()

    async run(client: FlintClient, message: Message) {

        if (!message?.channel) return

        const count = (this.#messageCount.get(message.author.id) ?? 0) + 1
        const sentWarning = this.#sentWarning.get(message.author.id) ?? false
        this.#messageCount.set(message.author.id, count)

        if (count > 5) {
            await message.delete().catch(() => {})
            if (!sentWarning) {
                await message.channel.send({
                    content: `${message.author.toString()} please slow down!`
                })
                this.#sentWarning.set(message.author.id, true)
            }
        }

        setTimeout(() => {
            this.#messageCount.delete(message.author.id)
            this.#sentWarning.delete(message.author.id)
        }, 5000)

    }

}
