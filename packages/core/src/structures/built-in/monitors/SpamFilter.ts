import { BaseMonitor } from "../../../structures/BaseMonitor"
import { FlintClient } from "../../../client/FlintClient"
import { Message } from "@fluxerjs/core"
import ms, { StringValue } from "ms"
import { log } from "../../../utils/logger"

export interface SpamFilterOptions {
    threshold?: number
    interval?: number | StringValue
    action?: "delete" | "warn" | "both"
    message?: string
}

export class SpamFilter extends BaseMonitor {

    #messageCount = new Map<String, number>()
    #options: Required<SpamFilterOptions>
    #warnings: Set<string>

    constructor(options: SpamFilterOptions = {}) {
        super({
            name: "spamfilter"
        })

        this.#options = {
            threshold: options.threshold ?? 5,
            interval: options.interval ?? "5 seconds",
            action: options.action ?? "both",
            message: options.message ?? "Please slow down."
        }

        this.#warnings = new Set()
    }

    get interval(): number {
        return typeof this.#options.interval === "string" ? ms(this.#options.interval) : this.#options.interval
    }

    get shouldDelete() {
        return ["delete", "both"].includes(this.#options.action)
    }

    get shouldWarn() {
        return ["warn", "both"].includes(this.#options.action)
    }

    async run(client: FlintClient, message: Message) {

        if (!message?.channel) return

        const count = (this.#messageCount.get(message.author.id) ?? 0) + 1
        const sentWarning = this.#warnings.has(message.author.id)
        this.#messageCount.set(message.author.id, count)

        if (count > this.#options.threshold) {
            if (this.shouldDelete) {
                await message.delete().catch((e) => log("warn", `Failed to delete SpamFilter message: ${e instanceof Error ? e.message : e}`))
            }
            if (this.shouldWarn && !sentWarning) {
                await message.channel.send({
                    content: `${message.author.toString()} ${this.#options.message}`
                })
                this.#warnings.add(message.author.id)
            }
        }

        setTimeout(() => {
            this.#messageCount.delete(message.author.id)
            this.#warnings.delete(message.author.id)
        }, this.interval)

    }

}
