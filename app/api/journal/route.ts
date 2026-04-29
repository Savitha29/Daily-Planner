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

    const date = new Date(dateStr)
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

    const entry = await db.collection("journal-entries").findOne({
      userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    })

    return NextResponse.json(entry || {})
  } catch (error) {
    console.error("Error fetching journal entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { date, affirmation, gratitude, highlights, reflection, mood } = await request.json()

    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.user.id)

    const dateObj = new Date(date)
    const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
    const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1)

    const result = await db.collection("journal-entries").updateOne(
      {
        userId,
        date: { $gte: startOfDay, $lt: endOfDay },
      },
      {
        $set: {
          affirmation: affirmation || "",
          gratitude: gratitude || [],
          highlights: highlights || [],
          reflection: reflection || "",
          mood: mood || "🙂",
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving journal entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
