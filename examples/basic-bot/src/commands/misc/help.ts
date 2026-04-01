import { defineCommand } from "@flint.js/core"
import { ExampleBotClient } from "../../"

export default defineCommand({
    name: "help",
    description: "Help command",
    category: "Misc",
    aliases: ["h"],
    prefixes: ["-"],

    generateCodeBlock(content: string): string {
        return `\`\`\`\n${content}\n\`\`\``
    },

    formatCommands(client: ExampleBotClient) {
        return client.commandHandler
            .getAll()
            .map((c) => `${c.name} - ${c.description}`).join("\n")
    },

    async execute(client, message, args) {
        const commandName = args[0]?.toLowerCase()

        if (commandName) {
            const command = client.commandHandler.getCommand(commandName)
            if (!command) {
                return message.reply("That command was not found")
            }

            const details = `Name: ${command.name}\nDescription: ${command.description}\nCategory: ${command.category}\nAliases: ${command.aliases?.join(", ")}\nAllowed Channels: ${command.allowedChannels?.join(", ") || "All"}\nDisabled: ${command.disabled ? "Yes" : "No"}\nPermissions: ${command.permissions?.join(", ") || "N/A"}`
            const content = this.generateCodeBlock(details)

            return message.reply({ content })
        }

        await message.reply({
            content: this.generateCodeBlock(this.formatCommands(client))
        })
    }

})
