import type { ILogger } from "../types/ILogger.js"
let _logger: ILogger | undefined

export function setLogger(logger: ILogger): void {
    _logger = logger
}

export function getLogger(): ILogger | undefined {
    return _logger
}

export function log(level: keyof ILogger, message: string, ...args: unknown[]): void {
    if (_logger) {
        (_logger[level] as Function)(message, ...args)
    } else {
        console.log(`[Flint] ${message}`, ...args)
    }
}
