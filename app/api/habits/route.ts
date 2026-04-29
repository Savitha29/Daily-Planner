import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Get or create default habits for user
    let habits = await db.collection("habits").find({ userId }).toArray()

    if (habits.length === 0) {
      const defaultHabits = [
        { name: "Drink Water", color: "bg-blue-500" },
        { name: "Exercise", color: "bg-red-500" },
        { name: "Reading", color: "bg-purple-500" },
        { name: "Sleep 8h", color: "bg-indigo-500" },
      ]

      const result = await db.collection("habits").insertMany(
        defaultHabits.map((habit) => ({
          userId,
          ...habit,
          completed: [],
          currentStreak: 0,
          bestStreak: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      )

      habits = await db.collection("habits").find({ userId }).toArray()
    }

    return NextResponse.json({ habits })
  } catch (error) {
    console.error("Error fetching habits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
