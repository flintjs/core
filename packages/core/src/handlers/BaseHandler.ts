import path from "node:path"
import url from "node:url"
import fs from "node:fs"

export async function importFile(filePath: string) {
    const resolved = path.resolve(filePath)
    const fileUrl = url.pathToFileURL(resolved).href
    const imported = await import(fileUrl)

    return imported.default ?? imported
}

export function isFile(filePath: string) {
    const stat = fs.statSync(filePath)
    return stat.isFile()
}

export function isDirectory(filePath: string) {
    const stat = fs.statSync(filePath)
    return stat.isDirectory()
}

export function scanFolder(folderPath: string, recursive = true): string[] {
    const entries = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .map(entry => path.join(folderPath, entry.name))
    let files: string[] = []

    for (const entry of entries) {
        if (isFile(entry) && entry.endsWith(".ts")) files.push(entry)
        else if (isDirectory(entry) && recursive) files = files.concat(scanFolder(entry, recursive))
    }

    return files
}
