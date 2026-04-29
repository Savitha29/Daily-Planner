"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Flame } from "lucide-react"
import type { Habit } from "@/lib/schemas"

const defaultHabits = [
  { name: "Drink Water", color: "bg-blue-500" },
  { name: "Exercise", color: "bg-red-500" },
  { name: "Reading", color: "bg-purple-500" },
  { name: "Sleep 8h", color: "bg-indigo-500" },
]

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/habits?date=${format(new Date(), "yyyy-MM-dd")}`)
      if (response.ok) {
        const data = await response.json()
        setHabits(data.habits || [])
      }
    } catch (error) {
      console.error("Error fetching habits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleHabit = async (habitId: string) => {
    try {
      await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: format(new Date(), "yyyy-MM-dd") }),
      })
      fetchHabits()
    } catch (error) {
      console.error("Error updating habit:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <h1 className="text-3xl font-serif font-bold mb-2">Habit Tracker</h1>
        <p className="text-muted-foreground">Build consistent habits and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => {
          const isCompletedToday = habit.completed?.[habit.completed.length - 1]

          return (
            <div key={habit._id?.toString()} className="glass-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{habit.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Flame size={16} className="text-secondary" />
                    <span className="text-sm font-medium">{habit.currentStreak} day streak</span>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleHabit(habit._id?.toString() || "")}
                  className={`px-4 py-2 rounded-lg transition ${
                    isCompletedToday
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-foreground hover:bg-secondary/30"
                  }`}
                >
                  {isCompletedToday ? "✓ Done" : "Mark Done"}
                </button>
              </div>

              {/* Monthly grid visualization */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded text-xs flex items-center justify-center ${
                      habit.completed?.[i] ? "bg-secondary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
