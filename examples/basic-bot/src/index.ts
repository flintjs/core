import { FlintClient, StatusType } from "@flint.js/core"
import { config } from "./config"

import "dotenv/config"

export const client = new FlintClient({
    intents: 0,
    presence: {
        custom_status: {
            text: "@flint.js/core !!"
        },
        status: StatusType.ONLINE
    },
    prefix: config.prefix,
    mentionPrefix: true,
    handlers: {
        commands: {
            paths: ["./src/commands"],
            recursive: true
        },
        events: {
            paths: ["./src/events"],
            recursive: true
        }
    }
})

client.login(process.env.TOKEN as string)
