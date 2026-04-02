import { Language } from "@flint.js/i18n"

export default class enUS extends Language {
    constructor() {
        super("en-US")
        this.language = {
            DEFAULT: (key) => `${key} has not been localized for ${this.name} yet.`,
            CLIENT_READY: "Logged in as {username}",
            INHIBITOR_PERMISSIONS_EMBED_TITLE: "Missing Permissions",
            INHIBITOR_USER_PERMISSIONS_EMBED_DESCRIPTION: "You don't have the required permissions to execute this command",
            INHIBITOR_BOT_PERMISSIONS_EMBED_DESCRIPTION: "I don't have the required permissions to execute this command",
            INHIBITOR_BOT_PERMISSIONS_EMBED_FIELD_TITLE: "Missing",
            INHIBITOR_DISABLED_EMBED_DESCRIPTION: "Disabled",
            INHIBITOR_DISABLED_EMBED_FIELD_TITLE: "This command is currently disabled",
            INHIBITOR_COOLDOWN_EMBED_TITLE: "Disabled",
            INHIBITOR_COOLDOWN_EMBED_DESCRIPTION: "⏱️ You can run this command again in `{remaining}`",
            PINGING: "Pinging...",
        }
    }
}
