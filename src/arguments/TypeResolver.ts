import type { FlintClient } from "../client/FlintClient.js"
import type { Message } from "@fluxerjs/core"
import { Argument } from "./Argument.js"
import ms, { StringValue } from "ms"

export type TypeResolverFn = (client: FlintClient, message: Message, phrase: string, arg: Argument) => unknown | Promise<unknown>

export class TypeResolver {

    #types: Map<string, TypeResolverFn> = new Map()

    constructor(client: FlintClient) {
        this.#registerBuiltins(client)
    }

    addType(name: string, resolver: TypeResolverFn): this {
        this.#types.set(name, resolver)
        return this
    }

    resolve(name: string, client: FlintClient, message: Message, phrase: string, arg: Argument): unknown {
        const resolver = this.#types.get(name)
        if (!resolver) throw new Error(`[Flint] Unknown argument type: "${name}"`)
        return resolver(client, message, phrase, arg)
    }

    has(name: string): boolean {
        return this.#types.has(name)
    }

    #registerBuiltins(client: FlintClient): void {

        this.addType("string", (_, __, phrase) => phrase || null)

        this.addType("StringValue", (_, __, phrase) => {
            const n = ms(phrase as StringValue)
            return isNaN(n) ? null : n
        })

        this.addType("number", (_, __, phrase) => {
            const n = Number(phrase)
            return isNaN(n) ? null : n
        })

        this.addType("integer", (_, __, phrase) => {
            const n = parseInt(phrase)
            return isNaN(n) ? null : n
        })

        this.addType("float", (_, __, phrase) => {
            const n = parseFloat(phrase)
            return isNaN(n) ? null : n
        })

        this.addType("boolean", (_, __, phrase) => {
            if (["true", "yes", "1", "on"].includes(phrase.toLowerCase())) return true
            if (["false", "no", "0", "off"].includes(phrase.toLowerCase())) return false
            return null
        })

        this.addType("url", (_, __, phrase) => {
            try { return new URL(phrase) } catch { return null }
        })

        this.addType("command", (client, _, phrase) => {
            if (!client || !client.commandHandler) return null

            return client.commandHandler.getCommand(phrase) ??
                client.commandHandler.getCommandByAlias(phrase)
        })

        this.addType("subcommand", (client, _, phrase, arg) => {
            if (!arg.required) return phrase
            if (!arg.options?.length) return null
            const match = arg.options.find(o => o === phrase)
            return match ?? null
        })

        this.addType("user", async (client, _, phrase) => {
            if (!phrase) return null

            const id = phrase.replace(/[<@!>]/g, "")
            const byId = client.users.get(id) ?? await client.users.fetch(id).catch(() => null)
            if (byId) return byId

            const lower = phrase.toLowerCase()

            return client.users.find(u =>
                u.username.toLowerCase() === lower ||
                u.globalName?.toLowerCase() === lower
            ) ?? null
        })

        this.addType("member", async (_, message, phrase) => {
            if (!phrase || !message.guild) return null

            const id = phrase.replace(/[<@!>]/g, "")
            const byId = message.guild.members.get(id) ?? await message.guild.fetchMember(id).catch(() => null)
            if (byId) return byId

            const lower = phrase.toLowerCase()
            return message.guild.members.find(m =>
                m.user.username.toLowerCase() === lower ||
                m.displayName?.toLowerCase() === lower ||
                m.user.globalName?.toLowerCase() === lower ||
                m.nick?.toLowerCase() === lower
            ) ?? null
        })

        this.addType("role", async (_, message, phrase) => {
            if (!phrase || !message.guild) return null

            const id = phrase.replace(/[<@&>]/g, "")
            const byId = message.guild.roles.get(id) ?? await message.guild.fetchRole(id).catch(() => null)
            if (byId) return byId

            const lower = phrase.toLowerCase()
            return message.guild.roles.find(r => r.name.toLowerCase() === lower) ?? null
        })

        this.addType("channel", async (_, message, phrase) => {
            if (!phrase || !message.guild) return null

            const id = phrase.replace(/[<@#>]/g, "")
            const channels = await message.guild.fetchChannels()
            if (!channels) return null

            const byId = channels.find(c => c.id === id)
            if (byId) return byId

            const lower = phrase.toLowerCase()
            return message.guild.channels.find(c => c.name?.toLowerCase() === lower) ?? null
        })

    }

}
