import {
    AntilinkMonitor,
    BotPermissionsInhibitor,
    ChannelTypeInhibitor,
    UserPermissionsInhibitor,
    CommandHandler,
    FlintClient,
    InhibitorHandler,
    ListenerHandler,
    MonitorHandler,
    StatusType,
    FluxerClientOptions
} from "@flint.js/core"
import { Logger } from "@flint.js/logger"
import { LanguageHandler } from "@flint.js/i18n"

import { config } from "./config"
import "dotenv/config"

export class ExampleBotClient extends FlintClient {

    i18n: LanguageHandler

    constructor(options: FluxerClientOptions = {}) {
        super({
            owners: config.owners
        }, {
            ...options,
            intents: 0,
            presence: {
                custom_status: {
                    text: "@flint.js/core !!"
                },
                status: StatusType.ONLINE
            }
        })

        this.logger = new Logger({
            prefix: "Bot",
            debug: true,
            timestamp: true
        })

        this.commandHandler = new CommandHandler(this, {
            directory: "./src/commands",
            prefix: config.prefix,
            mentionPrefix: true
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: "./src/listeners"
        })

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: "./src/inhibitors",
            builtins: [
                new ChannelTypeInhibitor(),
                new UserPermissionsInhibitor(),
                new BotPermissionsInhibitor()
            ]
        })

        this.monitorHandler = new MonitorHandler(this, {
            directory: "./src/monitors",
            builtins: [
                new AntilinkMonitor()
            ]
        })

        this.i18n = new LanguageHandler(this, {
            directory: "./src/languages",
            defaultLanguage: "en-US"
        })

        this.commandHandler
            .useLogger(this.logger)
            .useInhibitorHandler(this.inhibitorHandler)
            .useListenerHandler(this.listenerHandler)

    }

    public override async login(token: string) {
        await this.i18n.loadAll()
        await this.inhibitorHandler.loadAll()
        await this.listenerHandler.loadAll()
        await this.commandHandler.loadAll()
        return super.login(token)
    }

}

const client = new ExampleBotClient()
await client.login(process.env.TOKEN as string)
