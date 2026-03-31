export interface ParseResult {
    commandName: string
    args: string[]
    prefix: string
}

export function parseMessage(
    content: string,
    prefixes: string[],
    mentionPrefix: boolean,
    clientId: string,
): ParseResult | null {
    if (mentionPrefix) {
        const mentionRegex = new RegExp(`^<@!?${clientId}>(\s+)?`)
        const mentionMatch = mentionRegex.exec(content)
        if (mentionMatch) {
            const rest = content.slice(mentionMatch[0].length).trim()
            const [commandName, ...args] = rest.split(/\s+/)
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
    const [commandName, ...args] = rest.split(/\s+/)
    if (!commandName) return null

    return {
        commandName: commandName.toLowerCase(),
        args,
        prefix: matchedPrefix
    }
}
