import { opendir, readFile } from "fs/promises"
import { join, resolve } from "path"
import { exit } from "process"

const IMPROPER_IMPORT_REGEX = /import\s+(?!type).*\s+from\s+['"]@lucide\/svelte['"]\s*;?/g
const TYPE_IMPORT_REGEX = /import\s+type.*\s+from\s+['"]@lucide\/svelte['"]\s*;?/g

const EXCLUDED_DIRS = ["node_modules", ".git", "dist", ".svelte-kit", ".vercel"]
const INCLUDED_EXTENSIONS = [".svelte", ".js", ".ts"]

interface ImportResult {
  file: string
  matches: string[]
}

const checkFile = async (filePath: string): Promise<ImportResult | null> => {
  try {
    const content = await readFile(filePath, "utf8")

    if (TYPE_IMPORT_REGEX.test(content) && !IMPROPER_IMPORT_REGEX.test(content)) {
      return null
    }

    const matches = content.match(IMPROPER_IMPORT_REGEX)
    if (matches) {
      return {
        file: filePath,
        matches: matches
      }
    }
    return null
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

const scanDirectory = async (directory: string): Promise<ImportResult[]> => {
  const results: ImportResult[] = []

  try {
    const dir = await opendir(directory)

    for await (const entry of dir) {
      const path = join(directory, entry.name)

      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.includes(entry.name)) {
          const subResults = await scanDirectory(path)
          results.push(...subResults)
        }
      } else if (entry.isFile()) {
        const extension = path.substring(path.lastIndexOf(".") || 0)
        if (INCLUDED_EXTENSIONS.includes(extension)) {
          const result = await checkFile(path)
          if (result) {
            results.push(result)
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${directory}:`, error)
  }

  return results
}

const main = async (): Promise<void> => {
  console.log("Checking for incorrect @lucide/svelte imports...")

  const projectRoot = resolve(".")
  const results = await scanDirectory(projectRoot)

  if (results.length > 0) {
    console.log("\n❌ Found improper @lucide/svelte imports:")

    for (const result of results) {
      console.log(`\nFile: ${result.file}`)
      console.log("Improper imports:")
      result.matches.forEach((match, i) => {
        console.log(`  ${i + 1}. ${match.trim()}`)
      })
      console.log("\nCorrect usage examples:")
      console.log('  import { Circle } from "@lucide/svelte/icons/circle";')
      console.log('  import type { IconProps } from "@lucide/svelte";')
    }

    console.log("\n⚠️ Direct non-type imports from @lucide/svelte should be avoided.")
    console.log("   Instead, import specific icons from their direct path to reduce bundle size.")

    exit(1)
  } else {
    console.log("✅ No improper @lucide/svelte imports found!")
  }
}

main().catch(error => {
  console.error("An error occurred:", error)
  exit(1)
})
