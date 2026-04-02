import { Argument, type ArgumentOptions } from "./Argument"
import type { FlintClient } from "../client/FlintClient"
import type { TypeResolver } from "./TypeResolver"
import type { Message } from "@fluxerjs/core"

export class ArgumentRunner {

    #resolver: TypeResolver

    constructor(resolver: TypeResolver) {
        this.#resolver = resolver
    }

    async run(client: FlintClient, message: Message, rawArgs: string[], argDefinitions: readonly ArgumentOptions[]): Promise<Record<string, unknown>> {

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
                    const phrase = cleanArgs.slice(phraseIndex).join(" ")
                    phraseIndex = cleanArgs.length
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
        return await this.#resolver.resolve(arg.type, client, message, phrase)
    }

}
