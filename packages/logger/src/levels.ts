import { ansi, color } from "./ansi"

export type LogLevel = "info" | "success" | "warn" | "error" | "debug"

export const levels: Record<LogLevel, { label: string; color: string }> = {
    info:    { label: "INFO   ", color: ansi.blue },
    success: { label: "SUCCESS", color: ansi.green },
    warn:    { label: "WARN   ", color: ansi.yellow },
    error:   { label: "ERROR  ", color: ansi.red },
    debug:   { label: "DEBUG  ", color: ansi.gray }
}
