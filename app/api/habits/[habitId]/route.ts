import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { habitId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { habitId } = params
    const { date } = await request.json()

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    // Get habit and check if already completed today
    const habit = await db.collection("habits").findOne({
      _id: new ObjectId(habitId),
      userId,
    })

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 })
    }

    // Update completed array
    const completed = habit.completed || []
    if (!completed[completed.length - 1]) {
      completed.push(true)
    }

    // Calculate streak
    let currentStreak = 0
    for (let i = completed.length - 1; i >= 0; i--) {
      if (completed[i]) {
        currentStreak++
      } else {
        break
      }
    }

    const bestStreak = Math.max(habit.bestStreak || 0, currentStreak)

    await db.collection("habits").updateOne(
      { _id: new ObjectId(habitId), userId },
      {
        $set: {
          completed,
          currentStreak,
          bestStreak,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating habit:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
