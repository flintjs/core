import { Argument, type ArgumentOptions } from "./Argument.js"
import type { FlintClient } from "../client/FlintClient.js"
import type { TypeResolver } from "./TypeResolver.js"
import type { Message } from "@fluxerjs/core"

export class ArgumentRunner {

    #resolver: TypeResolver

    constructor(resolver: TypeResolver) {
        this.#resolver = resolver
    }

    async run(
        client: FlintClient,
        message: Message,
        rawArgs: string[],
        rawRest: string,
        argDefinitions: readonly ArgumentOptions[]
    ): Promise<Record<string, unknown>> {

        const args = argDefinitions.map(def => new Argument(def))
        const result: Record<string, unknown> = {}
        const usedIndexes = new Set<number>()

        for (const arg of args) {
            switch (arg.match) {
                case "flag": {
                    const flags = arg.flag ?? []

                    let found = false

                    rawArgs.forEach((a, i) => {
                        if (flags.includes(a)) {
                            usedIndexes.add(i)
                            found = true
                        }
                    })

                    result[arg.id] = found
                    break
                }
                case "option": {
                    const flags = arg.flag ?? []
                    let value: unknown = arg.resolveDefault(client, message)

                    rawArgs.forEach((a, i) => {
                        if (a.includes("=")) {
                            const [flag, val] = a.split("=")
                            if (flags.includes(flag)) {
                                usedIndexes.add(i)
                                value = val
                            }
                        } else if (flags.includes(a) && rawArgs[i + 1]) {
                            usedIndexes.add(i)
                            usedIndexes.add(i + 1)

                            value = rawArgs[i + 1]
                        }
                    })

                    const resolved = await this.#cast(arg, client, message, value as string)
                    result[arg.id] = resolved ?? arg.resolveDefault(client, message)
                    break
                }
            }
        }

        const cleanArgs = rawArgs.filter((_, i) => !usedIndexes.has(i))
        let phraseIndex = 0

        for (const arg of args) {
            switch (arg.match) {
                case "phrase": {
                    const phrase = cleanArgs[phraseIndex++] ?? ""
                    const resolved = await this.#cast(arg, client, message, phrase)
                    result[arg.id] = resolved ?? arg.resolveDefault(client, message)
                    break
                }

                case "rest": {
                    const parts = rawRest.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? []
                    let phrase = parts.slice(phraseIndex).join(" ")

                    for (const arg of args) {
                        if (arg.match === "flag" || arg.match === "option") {
                            const flags = arg.flag ?? []
                            for (const flag of flags) {
                                phrase = phrase.replace(new RegExp(`\\s*${flag}(=\\S+|\\s+\\S+)?`, "g"), "")
                            }
                        }
                    }

                    phrase = phrase.trim()
                    const resolved = await this.#cast(arg, client, message, phrase)
                    result[arg.id] = resolved ?? arg.resolveDefault(client, message)
                    break
                }
            }
        }

        return result

    }

    async #cast(arg: Argument, client: FlintClient, message: Message, phrase: string): Promise<unknown> {
        if (typeof arg.type === "function") {
            return await arg.type(client, message, phrase)
        }
        return await this.#resolver.resolve(arg.type, client, message, phrase, arg)
    }

}
