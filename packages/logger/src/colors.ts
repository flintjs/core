import { ansi, color } from "./ansi"

export const colors = {
    bold: (text: string) => `${ansi.bold}${text}${ansi.reset}`,
    dim: (text: string) => color(ansi.dim, text),
    red: (text: string) => color(ansi.red, text),
    green: (text: string) => color(ansi.green, text),
    yellow: (text: string) => color(ansi.yellow, text),
    blue: (text: string) => color(ansi.blue, text),
    cyan: (text: string) => color(ansi.cyan, text),
    gray: (text: string) => color(ansi.gray, text),
    magenta: (text: string) => color(ansi.magenta, text),
    white: (text: string) => color(ansi.white, text)
}
