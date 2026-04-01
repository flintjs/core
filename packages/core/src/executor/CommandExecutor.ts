import { buildContext, buildInhibitorContext } from "./CommandContext"
import { BaseListener } from "../structures/BaseListener"
import { FlintClient } from "../client/FlintClient"
import { Events, Message } from "@fluxerjs/core"
import { FlintClientListeners } from "../types"
import { parseMessage } from "./CommandParser"

export class CommandExecutor extends BaseListener {

    constructor() {
        super("_flinternal:commandExecute", {
            event: Events.MessageCreate,
            priority: 100
        })
    }

    getMentionRegex(id: string) {
        return new RegExp(`^<@!?${id}>(\s+)?`)
    }

    async execute(client: FlintClient, message: Message) {
        await client.monitorHandler?.run(client, message)

        const allPrefixes = [
            ...(client.commandHandler?.prefix ? [client.commandHandler?.prefix] : []),
            ...(client.commandHandler?.getAll() ?? []).flatMap((c) => c.prefixes ?? []),
        ]

        const parsed = parseMessage(
            message.content,
            allPrefixes,
            client.commandHandler?.mentionPrefix ?? false,
            client.user!.id
        )

        if (!parsed) return

        const command = client.commandHandler?.get(parsed.commandName) ?? client.commandHandler?.getCommandByAlias(parsed.commandName)
        if (!command) {
            client.emit(FlintClientListeners.CommandNotFound, {
                prefix: parsed.prefix,
                name: parsed.commandName,
                message
            })
            return
        }

        const validPrefixes = [
            ...(client.commandHandler?.prefix ? [client.commandHandler?.prefix] : []),
            ...(command.prefixes?.length ? command.prefixes : [])
        ]

        if (
            !validPrefixes.includes(parsed.prefix) &&
            (client.commandHandler?.mentionPrefix && !this.getMentionRegex(client.user!.id).exec(parsed.prefix))
        ) return

        const ctx = buildInhibitorContext(client, message, parsed, command)
        const result = await client.inhibitorHandler?.run(command, ctx)
        if (result && !result.ok) {
            client.emit(FlintClientListeners.CommandDenied, { result, ctx: ctx })
            return
        }

        try {
            const commandCtx = buildContext(client, message, parsed, command)
            await command.execute(...commandCtx)
            client.emit(FlintClientListeners.CommandSuccess, { ctx })
            // await client.finalizerHandler?.run(client, ctx)
        } catch (error) {
            client.emit(FlintClientListeners.CommandError, { ctx, error })
        }

    }

}
