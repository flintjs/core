import { FlintClient } from "../../../client/FlintClient"
import { parseTimeValueToMs } from "../../../utils/ms"
import { BaseMonitor } from "../../BaseMonitor"
import { log } from "../../../utils/logger"
import { Message } from "@fluxerjs/core"
import { StringValue } from "ms"

export interface AntilinkOptions {
    action?: "delete" | "warn" | "both"
    deleteOwnMessageDelay?: number | StringValue | null
    message?: string
    ownerBypass?: boolean
}

export class Antilink extends BaseMonitor {

    #options: Required<AntilinkOptions>
    #cache: Set<string>
    #warnings: Set<string>
    #regex: RegExp

    constructor(options: AntilinkOptions = {}) {
        super("Antilink", {})

        this.#options = {
            action: options.action ?? "both",
            message: options.message ?? "Advertising is not allowed",
            deleteOwnMessageDelay: options.deleteOwnMessageDelay ?? null,
            ownerBypass: options.ownerBypass ?? false
        }
        this.#cache = new Set()
        this.#warnings = new Set()
        this.#regex = /(?:web\.)?(?:fluxer\.gg|fluxer\.app\/invite|fluxer\.com\/invite)\/[a-zA-Z0-9]+/gim
    }

    get shouldDelete() {
        return ["delete", "both"].includes(this.#options.action)
    }

    get shouldWarn() {
        return ["warn", "both"].includes(this.#options.action)
    }

    async run(client: FlintClient, message: Message) {

        if (!message?.channel) return
        if (!message?.guild) return
        if (message.author.id === message.guild.members.me?.id) return
        if ((message.author.id === message.guild.ownerId) && this.#options.ownerBypass) return

        if (message.content.match(this.#regex)) {

            if (this.#cache.has(message.author.id) && this.shouldDelete) {
                await message.delete().catch((e) => log("warn", `Failed to delete Antilink message: ${e instanceof Error ? e.message : e}`))
                return
            }

            this.#cache.add(message.author.id)

            if (this.shouldWarn && !this.#warnings.has(message.author.id)) {
                if (this.shouldDelete) {
                    await message.delete().catch((e) => log("warn", `Failed to delete Antilink message: ${e instanceof Error ? e.message : e}`))
                }
                let msg = await message.channel.send({
                    content: `${message.author.toString()} ${this.#options.message}`
                })
                this.#warnings.add(message.author.id)

                const deleteAfter = parseTimeValueToMs(this.#options.deleteOwnMessageDelay)
                if (deleteAfter) {
                    setTimeout(() => msg.delete().catch((e) => log("warn", `Failed to delete Antilink warn message: ${e instanceof Error ? e.message : e}`)), deleteAfter)
                }
            }

            setTimeout(() => {
                this.#cache.delete(message.author.id)
                this.#warnings.delete(message.author.id)
            }, 300_000)
        }

    }


}
