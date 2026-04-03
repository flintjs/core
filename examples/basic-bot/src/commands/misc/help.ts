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

        let command = args?.command

        if (!command) {
            return await message.reply({
                content: this.generateCodeBlock(this.formatCommands(client))
            })
        }

        const details = [
            `Name: ${command.name}`,
            `Description: ${command.description}`,
            `Category: ${command.category}`,
            `Aliases: ${command.aliases?.join(" | ") || "None"}`,
            `Prefixes: ${command.prefixes?.join(" | ") || "None"}`,
            `Allowed Channels: ${command.allowedChannels?.join(", ") || "All"}`,
            `Disabled: ${command.disabled ? "✅" : "❌"}`,
            `Owner Only: ${command.ownerOnly ? "✅" : "❌"}`,
            `Permissions: ${client.commandHandler.resolveCommandPermissions(command.permissions)?.join(", ") || "N/A"}`
        ].join("\n")

        const content = this.generateCodeBlock(details)

        return message.reply({ content })

    }

})
