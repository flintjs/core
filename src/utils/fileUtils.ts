import { log } from "./logger"
import path from "node:path"
import url from "node:url"
import fs from "node:fs"

type ModuleType = "language" | "schedule" | "other"

export async function importFile<T = any>(filePath: string) {
    try {
        const resolved = path.resolve(filePath)
        const fileUrl = url.pathToFileURL(resolved).href
        const imported = await import(fileUrl)
        const isLangMatch = new RegExp(/extends Language/)
        const isScheduleMatch = new RegExp(/extends Schedule/)
        const isClassMatch = new RegExp(/^class/)

        const moduleType: ModuleType = !!isLangMatch.test((imported.default ?? imported)?.toString())
            ? "language"
            : !!isScheduleMatch.test((imported.default ?? imported)?.toString())
            ? "schedule"
            : "other"

        return {
            type: moduleType,
            isClass: isClassMatch.test((imported.default ?? imported)?.toString()),
            module: (imported.default ?? imported) as T
        }
    } catch (error) {
        log("error", `Failed to import ${filePath}`, error)
        return { isClass: false, isLanguage: false, module: null }
    }
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
