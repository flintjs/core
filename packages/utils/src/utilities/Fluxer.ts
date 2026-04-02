export function toCode(content: string): string {
    return `\`${content}\``
}

export function toCodeBlock(content: string, lang?: string): string {
    return `\`\`\`${lang ?? ""}\n${content}\n\`\`\``
}

export function toBold(content: string): string {
    return `**${content}**`
}

export function toItalic(content: string): string {
    return `*${content}*`
}

export function toUnderline(content: string): string {
    return `__${content}__`
}

export function toStrikethrough(content: string): string {
    return `~~${content}~~`
}
