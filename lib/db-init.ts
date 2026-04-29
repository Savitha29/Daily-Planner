import { initializeDatabase } from "./db"

let initialized = false

export async function ensureDbInitialized() {
  if (initialized) return
  try {
    await initializeDatabase()
    initialized = true
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}
