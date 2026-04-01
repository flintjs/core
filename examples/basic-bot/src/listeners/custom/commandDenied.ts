import { defineListener, FlintClientListeners } from "@flint.js/core"

export default defineListener({
    event: FlintClientListeners.CommandDenied,
    name: "commandDenied",
    priority: 0,

    async execute(client, { ctx, result }) {
        if (result.ok) return

        let embed = {}

        switch (result.reason) {
            case "user.permissions":
                embed = {
                    title: "Missing Permissions",
                    description: "You don't have the required permissions to execute this command"
                }
            break
            case "bot.permissions":
                embed = {
                    title: "Missing Permissions",
                    description: "I don't have the required permissions to execute this command",
                    fields: [
                        {
                            name: "Permissions",
                            value: result.missing?.map((p) => `\`${p}\``).join(", ")
                        }
                    ]
                }
            break
            case "disabled":
                embed = {
                    title: "Disabled",
                    description: "This command is currently disabled"
                }
            break
            case "cooldown":
                embed = {
                    title: "Cooldown",
                    description: `⏱️ You can run this command again in \`${result.formatted}\``
                }
            break
            default: return
        }

        await ctx.message.reply({ embeds: [embed] })

    }

})
