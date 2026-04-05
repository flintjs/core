import type { User, GuildMember, Role, GuildChannel, Message } from "@fluxerjs/core"
import { BaseCommand as Command } from "../structures/BaseCommand.js"
import type { ArgumentOptions, ArgumentType } from "./Argument.js"
import type { FlintClient } from "../client/FlintClient.js"

export type ResolveArgumentType<T extends ArgumentType> =
    T extends "string" ? string :
    T extends "StringValue" ? number :
    T extends "number" | "integer" | "float" ? number :
    T extends "boolean" ? boolean :
    T extends "url" ? URL :
    T extends "command" ? Command :
    T extends "user" ? User :
    T extends "member" ? GuildMember :
    T extends "role" ? Role :
    T extends "channel" ? GuildChannel :
    T extends (client: FlintClient, message: Message, phrase: string) => infer R ? R :
    unknown

export type ResolveArgument<T extends ArgumentOptions> =
    T extends { match: "flag" }
        ? boolean
        : T extends { default: infer D }
            ? ResolveArgumentType<NonNullable<T["type"]>> | (D extends (...args: any[]) => infer R ? R : D)
            : ResolveArgumentType<NonNullable<T["type"]>> | null

export type ResolveArgs<T extends readonly ArgumentOptions[]> = {
    [K in T[number] as K["id"]]: ResolveArgument<K>
}
