export interface ParseResult {
    commandName: string
    args: string[]
    prefix: string
}

export function parseArgs(input: string): string[] {
    const args: string[] = []
    let current = ""
    let inQuote: string | null = null

    for (let i = 0; i < input.length; i++) {
        const char = input[i]

        if (char === "\\" && inQuote && input[i + 1] === inQuote) {
            current += inQuote
            i++
            continue
        }

        if ((char === '"' || char === "'") && !inQuote) {
            inQuote = char
            continue
        }

        if (char === inQuote) {
            inQuote = null
            args.push(current)
            current = ""
            continue
        }

        if (char === " " && !inQuote) {
            if (current) {
                args.push(current)
                current = ""
            }
            continue
        }

        current += char
    }

    if (current) args.push(current)
    return args
}

export function parseMessage(
    content: string,
    prefixes: string[],
    mentionPrefix: boolean,
    clientId: string,
): ParseResult | null {
    if (mentionPrefix) {
        const mentionRegex = new RegExp(`^<@!?${clientId}>(\\s+)?`)
        const mentionMatch = mentionRegex.exec(content)
        if (mentionMatch) {
            const rest = content.slice(mentionMatch[0].length).trim()
            const [commandName, ...args] = parseArgs(rest)
            if (!commandName) return null
            return {
                commandName: commandName.toLowerCase(),
                args,
                prefix: mentionMatch[0]
            }
        }
    }

    const matchedPrefix = prefixes.find((p) => content.startsWith(p))
    if (!matchedPrefix) return null

    const rest = content.slice(matchedPrefix.length).trim()
    const [commandName, ...args] = parseArgs(rest)
    if (!commandName) return null

    return {
        commandName: commandName.toLowerCase(),
        args,
        prefix: matchedPrefix
    }
}
