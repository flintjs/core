import type { HandlerOptions, HandlerLoadResult } from "../types"
import type { FlintClient } from "../client/FlintClient"
import { importFile, scanFolder } from "./BaseHandler"

export class CommandHandler {

    private client: FlintClient
    private options?: HandlerOptions
    private flintCommands = new Map<string, any>()

    constructor(client: FlintClient, options?: HandlerOptions) {
        this.client = client
        this.options = options
    }

    public async loadAll(): Promise<HandlerLoadResult> {

        const loaded: string[] = []
        const failed: HandlerLoadResult["failed"] = []

        if (!this.options?.paths?.length) return { loaded, failed }

        for (const folder of this.options.paths) {
            const files = scanFolder(folder, this.options.recursive)
            for (const file of files) {
                try {
                    const command = await importFile(file)
                    if (!command?.execute || !command.name) {
                        throw new Error("Invalid command format")
                    }

                    this.flintCommands.set(command.name, command)

                    loaded.push(file)
                } catch (error) {
                    failed.push({ path: file, error: error as Error })
                }
            }
        }

        return { loaded, failed }

    }

    public getCommand(name: string) {
        return this.flintCommands.get(name)
    }

    public getCommandByAlias(name: string) {
        const commands = Array.from(this.flintCommands.values())
        return commands.find((c) => c.aliases?.includes(name))
    }

    public getAllCommands() {
        return Array.from(this.flintCommands.values())
    }

}
