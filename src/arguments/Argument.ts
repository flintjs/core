import type { FlintClient } from "../client/FlintClient.js"
import type { Message } from "@fluxerjs/core"

export type ArgumentMatch = "phrase" | "rest" | "flag" | "option"

export type ArgumentType =
    | "string"
    | "StringValue"
    | "number"
    | "integer"
    | "float"
    | "boolean"
    | "url"
    | "command"
    | "user"
    | "member"
    | "role"
    | "channel"
    | ((client: FlintClient, message: Message, phrase: string) => unknown)

export interface ArgumentOptions {
    id: string
    type?: ArgumentType
    match?: ArgumentMatch
    flag?: string | string[]
    default?: unknown | ((client: FlintClient, message: Message) => unknown)
}

export class Argument {

    id: string
    type: ArgumentType
    match: ArgumentMatch
    flag?: string[]
    default?: unknown | ((client: FlintClient, message: Message) => unknown)

    constructor(options: ArgumentOptions) {
        this.id = options.id
        this.type = options.type ?? "string"
        this.match = options.match ?? "phrase"
        this.flag = options.flag
            ? Array.isArray(options.flag) ? options.flag : [options.flag]
            : undefined
        this.default = options.default ?? null
    }

    resolveDefault(client: FlintClient, message: Message): unknown {
        return typeof this.default === "function"
            ? this.default(client, message)
            : this.default ?? null
    }

}
