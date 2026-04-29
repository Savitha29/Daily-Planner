import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const uri = process.env.MONGODB_URI || ""
  if (!uri) {
    throw new Error("MONGODB_URI is not defined")
  }

  const client = await MongoClient.connect(uri)
  const db = client.db("daily-planner")

  cachedClient = client
  cachedDb = db

  return { client, db }
}

// Initialize collections with indexes
export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Users collection
  await db.collection("users").createIndex({ email: 1 }, { unique: true })

  // Daily Planner collection
  await db.collection("daily-planners").createIndex({ userId: 1, date: 1 }, { unique: true })

  // Tasks collection
  await db.collection("tasks").createIndex({ userId: 1, plannerId: 1 })
  await db.collection("tasks").createIndex({ userId: 1, date: 1 })

  // Journal Entries collection
  await db.collection("journal-entries").createIndex({ userId: 1, date: 1 }, { unique: true })

  // Habits collection
  await db.collection("habits").createIndex({ userId: 1, date: 1 }, { unique: true })

  console.log("Database initialized successfully")
}
