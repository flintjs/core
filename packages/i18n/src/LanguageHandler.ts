import { BaseHandler, BaseHandlerOptions, type FlintClient } from "@flint.js/core"
import { Language } from "./Language"

export interface LanguageHandlerOptions extends BaseHandlerOptions {
    defaultLanguage?: string
}

export class LanguageHandler extends BaseHandler<Language> {

    #defaultLanguage: string

    constructor(client: FlintClient, options: LanguageHandlerOptions) {
        super(client, options)
        this.#defaultLanguage = options.defaultLanguage ?? "en-US"
    }

    get(name: string): Language | undefined {
        return this.store.get(name)
    }

    translate(key: string, params?: Record<string, unknown>, languageName?: string): string {
        return this.t(key, params, languageName)
    }

    translation(key: string, params?: Record<string, unknown>, languageName?: string): string {
        return this.t(key, params, languageName)
    }

    t(key: string, params?: Record<string, unknown>, languageName?: string): string {

        if (params === undefined) {
            const defaultLang = this.store.get(this.#defaultLanguage)
            if (!defaultLang) return key
            return defaultLang.get(key)
        }

        const name = languageName ?? this.#defaultLanguage
        const language = this.store.get(name)

        if (!language) {
            const defaultLang = this.store.get(this.#defaultLanguage)
            if (!defaultLang) return key
            return defaultLang.get(key, params)
        }

        const result = language.get(key, params)

        if (result === key && name !== this.#defaultLanguage) {
            const defaultLang = this.store.get(this.#defaultLanguage)
            if (defaultLang) return defaultLang.get(key, params)
        }

        return result
    }

    get defaultLanguage(): string {
        return this.#defaultLanguage
    }

}
