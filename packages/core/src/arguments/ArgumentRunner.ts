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
        let phraseIndex = 0

        for (const arg of args) {
            switch (arg.match) {
                case "phrase": {
                    const phrase = rawArgs[phraseIndex++] ?? ""
                    const resolved = await this.#cast(arg, client, message, phrase)
                    result[arg.id] = resolved ?? arg.resolveDefault(client, message)
                    break
                }
                case "rest": {
                    const phrase = rawArgs.slice(phraseIndex).join(" ")
                    phraseIndex = rawArgs.length
                    const resolved = await this.#cast(arg, client, message, phrase)
                    result[arg.id] = resolved ?? arg.resolveDefault(client, message)
                    break
                }
                case "flag": {
                    const flags = arg.flag ?? []
                    const flagIndex = rawArgs.findIndex(a => flags.includes(a))
                    if (flagIndex !== -1 && rawArgs[flagIndex + 1]) {
                        const phrase = rawArgs[flagIndex + 1]
                        const resolved = await this.#cast(arg, client, message, phrase)
                        result[arg.id] = resolved ?? arg.resolveDefault(client, message)
                    } else {
                        result[arg.id] = arg.resolveDefault(client, message)
                    }
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
