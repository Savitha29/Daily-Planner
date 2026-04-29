import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, date, timeOfDay, priority } = await request.json()

    if (!title || !date || !timeOfDay) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Parse date
    const dateObj = new Date(date)
    const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())

    // Get or create planner for the day
    let planner = await db.collection("daily-planners").findOne({
      userId,
      date: startOfDay,
    })

    if (!planner) {
      const result = await db.collection("daily-planners").insertOne({
        userId,
        date: startOfDay,
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      planner = { _id: result.insertedId }
    }

    const result = await db.collection("tasks").insertOne({
      userId,
      plannerId: planner._id,
      date: startOfDay,
      title,
      completed: false,
      priority: priority || "medium",
      timeOfDay,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, taskId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
