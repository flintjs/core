import ms, { StringValue } from "ms"

export function parseTimeValueToMs(value: any): number | null {
    let valueMs
    if (typeof value === "number") valueMs = value
    else if (typeof value === "string") valueMs = ms(value as StringValue)
    else return null

    if (!valueMs) return null
    return valueMs
}
