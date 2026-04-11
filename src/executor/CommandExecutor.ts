import { buildContext, buildInhibitorContext } from "./CommandContext.js"
import { BaseListener } from "../structures/BaseListener.js"
import { FlintClientListeners } from "../types/index.js"
import { FlintClient } from "../client/FlintClient.js"
import { kInhibitors } from "../internal/symbols.js"
import { parseMessage } from "./CommandParser.js"
import { Events, Message } from "@fluxerjs/core"

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
            client.emit(FlintClientListeners.CommandDenied, { result, ctx })
            return
        }
        const internalResult = await client[kInhibitors].run(command, ctx)
        if (internalResult && !internalResult.ok) {
            client.emit(FlintClientListeners.CommandDenied, { result: internalResult, ctx })
            return
        }

        const parsedArgs = await client.commandHandler.getArgumentRunner().run(
            client,
            message,
            parsed.args,
            parsed.rawRest,
            command.args ?? []
        )

        const commandArgs = command.args?.map(a => ({
            ...a,
            required: "required" in a ? a.required : true
        })) ?? []

        for (const arg of commandArgs) {
            if (!arg.required) continue
            if (!parsedArgs[arg.id]) {
                client.emit(FlintClientListeners.CommandMissingRequiredArgument, { ctx, command, argument: arg.id })
                return
            }
        }

        try {
            const commandCtx = buildContext(client, message, parsed, parsedArgs, command)
            await command.execute(...commandCtx)
            client.emit(FlintClientListeners.CommandSuccess, { ctx })
            // await client.finalizerHandler?.run(client, ctx)
        } catch (error) {
            client.emit(FlintClientListeners.CommandError, { ctx, error })
        }

    }

}
