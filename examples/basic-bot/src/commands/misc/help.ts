import { PermissionsBitField } from "@fluxerjs/core"
import { defineCommand } from "@flint.js/core"
import { ExampleBotClient } from "../../"

export default defineCommand({
    name: "help",
    description: "Help command",
    category: "Misc",
    aliases: ["h"],
    prefixes: ["-"],
    args: [
        { id: "command", type: "command" }
    ] as const,

    generateCodeBlock(content: string): string {
        return `\`\`\`\n${content}\n\`\`\``
    },

    formatCommands(client: ExampleBotClient) {
        return client.commandHandler
            .getAll()
            .map((c) => `${c.name} - ${c.description}`).join("\n")
    },

    async execute(client, message, args) {

        let command = args.command

        if (!command) {
            return await message.reply({
                content: this.generateCodeBlock(this.formatCommands(client))
            })
        }

        const details = `Name: ${command.name}\nDescription: ${command.description}\nCategory: ${command.category}\nAliases: ${command.aliases?.join(", ")}\nAllowed Channels: ${command.allowedChannels?.join(", ") || "All"}\nDisabled: ${command.disabled ? "Yes" : "No"}\nPermissions: ${client.commandHandler.resolveCommandPermissions(command.permissions)?.join(", ") || "N/A"}`
        const content = this.generateCodeBlock(details)

        return message.reply({ content })

    }

})
