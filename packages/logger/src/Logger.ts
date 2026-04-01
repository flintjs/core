import { levels, LogLevel } from "./levels"
import { ansi, color } from "./ansi"

export interface LoggerOptions {
    prefix?: string
    debug?: boolean
    timestamp?: boolean
}

export class Logger {

    #prefix: string
    #debug: boolean
    #timestamp: boolean

    constructor(options: LoggerOptions = {}) {
        this.#prefix = options.prefix ?? "Flint"
        this.#debug = options.debug ?? false
        this.#timestamp = options.timestamp ?? true
    }

    #format(level: LogLevel, message: string): string {
        const { label, color: levelColor } = levels[level]

        const timestamp = this.#timestamp
            ? color(ansi.gray, `[${new Date().toLocaleTimeString()}]`) + " "
            : ""

        const prefix = color(ansi.cyan, `[${this.#prefix}]`)
        const levelLabel = color(levelColor, label)

        return `${timestamp}${prefix} ${levelLabel} ${message}`
    }

    #write(level: LogLevel, message: string, ...args: unknown[]): void {
        const formatted = this.#format(level, message)
        if (level === "error") {
            console.error(formatted, ...args)
        } else {
            console.log(formatted, ...args)
        }
    }

    info(message: string, ...args: unknown[]): void {
        this.#write("info", message, ...args)
    }

    success(message: string, ...args: unknown[]): void {
        this.#write("success", message, ...args)
    }

    warn(message: string, ...args: unknown[]): void {
        this.#write("warn", message, ...args)
    }

    error(message: string, ...args: unknown[]): void {
        this.#write("error", message, ...args)
    }

    debug(message: string, ...args: unknown[]): void {
        if (!this.#debug) return
        this.#write("debug", message, ...args)
    }

}
