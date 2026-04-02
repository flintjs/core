import { EmbedBuilder, PermissionFlags } from "@fluxerjs/core"
import { defineCommand } from "@flint.js/core"

export default defineCommand({
    name: "ban",
    description: "Ban a member from the server",
    category: "Mod",
    aliases: ["boot"],
    args: [
        {
            id: "member",
            type: "member"
        },
        {
            id: "reason",
            type: "string"
        }
    ] as const,
    permissions: [PermissionFlags.BanMembers, PermissionFlags.ModerateMembers, PermissionFlags.SendMessages],

    async execute(client, message, args) {

        if (!args.member) {
            return message.reply("Please provide a member to ban")
        }

        const embed = new EmbedBuilder()
            .setTitle("Ban")
            .setDescription(`✅ ${args.member.user.toString()} has been banned from the server`)

        return message.reply({
            embeds: [embed]
        })

    }

})
