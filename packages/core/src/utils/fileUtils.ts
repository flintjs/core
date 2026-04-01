import { BaseInhibitor } from "../structures/BaseInhibitor"
import { BaseListener } from "../structures/BaseListener"
import { BaseCommand } from "../structures/BaseCommand"
import { BaseMonitor } from "../structures/BaseMonitor"
import { log } from "./logger"
import path from "node:path"
import url from "node:url"
import fs from "node:fs"

export async function importFile<T = any>(filePath: string) {
    try {
        const resolved = path.resolve(filePath)
        const fileUrl = url.pathToFileURL(resolved).href
        const imported = await import(fileUrl)

        return (imported.default ?? imported) as T
    } catch (error) {
        log("error", `Failed to import ${filePath}`, error)
        return null
    }
}

export function isClass(input: any): boolean {
    return input?.prototype instanceof BaseCommand
        || input?.prototype instanceof BaseListener
        || input?.prototype instanceof BaseInhibitor
        || input?.prototype instanceof BaseMonitor
}

export function isFile(filePath: string) {
    try {
        const stat = fs.statSync(filePath)
        return stat.isFile()
    } catch (error) {
        log("error", `Failed to check ${filePath} stat`, error)
        return false
    }
}

export function isDirectory(filePath: string) {
    try {
        const stat = fs.statSync(filePath)
        return stat.isDirectory()
    } catch (error) {
        log("error", `Failed to check ${filePath} stat`, error)
        return false
    }
}

export function scanFolder(folderPath: string, recursive = true): string[] {
    try {
        const entries = fs
            .readdirSync(folderPath, { withFileTypes: true })
            .map(entry => path.join(folderPath, entry.name))
        let files: string[] = []

        for (const entry of entries) {
            if (isFile(entry) && entry.endsWith(".ts")) files.push(entry)
            else if (isDirectory(entry) && recursive) files = files.concat(scanFolder(entry, recursive))
        }
        return files
    } catch (error) {
        return []
    }
}
