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

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date")

    if (!dateStr) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Parse date to get start and end of day
    const date = new Date(dateStr)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

    // Get or create planner for the day
    let planner = await db.collection("daily-planners").findOne({
      userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    })

    if (!planner) {
      const result = await db.collection("daily-planners").insertOne({
        userId,
        date: startOfDay,
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      planner = await db.collection("daily-planners").findOne({ _id: result.insertedId })
    }

    // Get tasks for the day
    const tasks = await db
      .collection("tasks")
      .find({
        userId,
        date: { $gte: startOfDay, $lt: endOfDay },
      })
      .sort({ timeOfDay: 1, createdAt: 1 })
      .toArray()

    return NextResponse.json({
      planner,
      tasks,
      notes: planner?.notes || "",
    })
  } catch (error) {
    console.error("Error fetching planner:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get("date")
    const { notes } = await request.json()

    if (!dateStr) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    const date = new Date(dateStr)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

    const result = await db.collection("daily-planners").updateOne(
      {
        userId,
        date: { $gte: startOfDay, $lt: endOfDay },
      },
      {
        $set: {
          notes,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error("Error updating planner:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
