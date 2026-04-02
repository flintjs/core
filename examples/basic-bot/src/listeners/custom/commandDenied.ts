import { defineListener, FlintClientListeners } from "@flint.js/core"
import { ExampleBotClient } from "../../index"

export default defineListener({
    event: FlintClientListeners.CommandDenied,
    name: "commandDenied",
    priority: 0,

    async execute(client: ExampleBotClient, { ctx, result }) {
        if (result.ok) return

        let embed = {}

        switch (result.reason) {
            case "ownerOnly":
                embed = {
                    title: client.i18n.t("INHIBITOR_OWNER_ONLY_EMBED_TITLE"),
                    description: client.i18n.t("INHIBITOR_OWNER_ONLY_EMBED_DESCRIPTION")
                }
            break
            case "user.permissions":
                embed = {
                    title: client.i18n.t("INHIBITOR_PERMISSIONS_EMBED_TITLE"),
                    description: client.i18n.t("INHIBITOR_USER_PERMISSIONS_EMBED_DESCRIPTION")
                }
            break
            case "bot.permissions":
                embed = {
                    title: client.i18n.t("INHIBITOR_PERMISSIONS_EMBED_TITLE"),
                    description: client.i18n.t("INHIBITOR_BOT_PERMISSIONS_EMBED_DESCRIPTION"),
                    fields: [
                        {
                            name: client.i18n.t("INHIBITOR_BOT_PERMISSIONS_EMBED_FIELD_TITLE"),
                            value: result.missing?.map((p) => `\`${p}\``).join(", ")
                        }
                    ]
                }
            break
            case "disabled":
                embed = {
                    title: client.i18n.t("INHIBITOR_DISABLED_EMBED_TITLE"),
                    description: client.i18n.t("INHIBITOR_DISABLED_EMBED_DESCRIPTION")
                }
            break
            case "cooldown":
                embed = {
                    title: client.i18n.t("INHIBITOR_COOLDOWN_EMBED_TITLE"),
                    description: client.i18n.t("INHIBITOR_COOLDOWN_EMBED_DESCRIPTION", { remaining: result.formatted })
                }
            break
            default: return
        }

        await ctx.message.reply({ embeds: [embed] })

    }

})
