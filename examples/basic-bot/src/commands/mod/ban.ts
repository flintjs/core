import { EmbedBuilder, PermissionFlags } from "@fluxerjs/core"
import { defineCommand } from "@flint.js/core"

export default defineCommand({
    name: "ban",
    description: "Ban a member from the server",
    category: "Mod",
    aliases: ["boot"],
    permissions: [PermissionFlags.BanMembers, PermissionFlags.ModerateMembers, PermissionFlags.SendMessages],

    async execute(client, message, args) {

        const embed = new EmbedBuilder()
            .setTitle("Ban")
            .setDescription("User has been banned from the server")

        return message.reply({
            embeds: [embed]
        })

    }

})
