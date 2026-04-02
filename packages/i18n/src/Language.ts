import { interpolate } from "./interpolate"

export type LanguageValue =
    | string
    | string[]
    | ((params: Record<string, unknown>) => string)
    | ((key: string) => string)

export type LanguageMap = {
    DEFAULT: (key: string) => string
    [key: string]: LanguageValue
}

export abstract class Language {

    readonly name: string
    language: Partial<LanguageMap> = {}

    constructor(name: string) {
        this.name = name
    }

    get(key: string, params: Record<string, unknown> = {}): string {
        const value = this.language[key]

        if (value === undefined) {
            const fallback = this.language.DEFAULT
            return fallback ? fallback(key) : key
        }

        if (typeof value === "function") {
            return (value as (params: Record<string, unknown>) => string)(params)
        }

        if (Array.isArray(value)) {
            return value.map(line => interpolate(line, params)).join("\n")
        }

        return interpolate(value, params)
    }

}
