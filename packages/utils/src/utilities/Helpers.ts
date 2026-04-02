export function isFunction(input: unknown): boolean {
    return typeof input === "function"
}

export function isObject(input: unknown): boolean {
    return input
        ? input.constructor === Object
        : false
}

export function isArray(input: unknown): boolean {
    return typeof input === "object" && Array.isArray(input)
}

export function isThenable(input: unknown): boolean {
    if (!input) return false
    return (input instanceof Promise) || (input !== Promise.prototype && (isFunction((input as Promise<unknown>).then)) && isFunction((input as Promise<unknown>).catch))
}

export function randomArrayItem<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)]
}

export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function truncate(content: string, maxLength: number = 30): string {
    if (content.length > maxLength) {
        return `${content.slice(0, maxLength - 3)}...`
    }
    return content
}
