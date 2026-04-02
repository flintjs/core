export function interpolate(template: string, params: Record<string, unknown> = {}): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        if (key in params) {
            return String(params[key])
        }
        return match
    })
}
