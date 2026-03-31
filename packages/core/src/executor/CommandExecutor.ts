import { buildContext, buildPreconditionContext } from "./CommandContext"
import { defineEvent } from "../factories/event"
import { parseMessage } from "./CommandParser"
import { FlintClientEvents } from "../types"
import { Events } from "@fluxerjs/core"

export default defineEvent({
    event: Events.MessageCreate,
    name: "_flint:commandExecute",
    priority: 0,

    getMentionRegex(id: string) {
        return new RegExp(`^<@!?${id}>(\s+)?`)
    },

    async execute(client, message) {

        const allPrefixes = [
            client.prefix,
            ...client.flintCommands.getAllCommands().flatMap((c) => c.prefixes ?? []),
        ]

        const parsed = parseMessage(
            message.content,
            allPrefixes,
            client.mentionPrefix ?? false,
            client.user!.id
        )

        if (!parsed) return

        const command = client.flintCommands.getCommand(parsed.commandName) ?? client.flintCommands.getCommandByAlias(parsed.commandName)
        if (!command) {
            client.emit(FlintClientEvents.CommandNotFound, {
                prefix: parsed.prefix,
                name: parsed.commandName,
                message
            })
            return
        }

        const validPrefixes = [
            client.prefix,
            ...(command.prefixes?.length ? command.prefixes : [])
        ]

        if (
            !validPrefixes.includes(parsed.prefix) &&
            (client.mentionPrefix && !this.getMentionRegex(client.user!.id).exec(parsed.prefix))
        ) return

        const preconditionCtx = buildPreconditionContext(client, message, parsed, command)
        const result = await client.preconditions.run(command, preconditionCtx)
        if (!result.ok) {
            client.emit(FlintClientEvents.CommandDenied, { result, ctx: preconditionCtx })
            return
        }

        const ctx = buildContext(client, message, parsed, command)
        try {
            await command.execute(...ctx)
            client.emit(FlintClientEvents.CommandSuccess, { ctx })
        } catch (error) {
            client.emit(FlintClientEvents.CommandError, { ctx, error })
        }

    }

})
