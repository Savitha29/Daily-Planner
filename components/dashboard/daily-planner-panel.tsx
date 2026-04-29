"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import type { Task } from "@/lib/schemas"

interface DailyPlannerPanelProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function DailyPlannerPanel({ date, onDateChange }: DailyPlannerPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [newTask, setNewTask] = useState("")
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<"morning" | "afternoon" | "evening">("morning")

  useEffect(() => {
    fetchData()
  }, [date])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/planner?date=${format(date, "yyyy-MM-dd")}`)
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
        setNotes(data.notes || "")
      }
    } catch (error) {
      console.error("Error fetching planner data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask,
          date: format(date, "yyyy-MM-dd"),
          timeOfDay: selectedTimeOfDay,
          priority: "medium",
        }),
      })

      if (response.ok) {
        setNewTask("")
        fetchData()
      }
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })
      fetchData()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      fetchData()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const timeOfDayGroups = {
    morning: tasks.filter((t) => t.timeOfDay === "morning"),
    afternoon: tasks.filter((t) => t.timeOfDay === "afternoon"),
    evening: tasks.filter((t) => t.timeOfDay === "evening"),
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header with date navigation */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold">Daily Tasks</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDateChange(new Date(date.getTime() - 86400000))}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium min-w-32 text-center">{format(date, "MMM dd, yyyy")}</span>
            <button
              onClick={() => onDateChange(new Date(date.getTime() + 86400000))}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <ChevronRight size={20} />
            </button>
           
          </div>
        </div>
      </div>
      <form>

      </form>

      {/* Add new task form */}
      <form onSubmit={handleAddTask} className="glass-card">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <select
            value={selectedTimeOfDay}
            onChange={(e) => setSelectedTimeOfDay(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </form>

      {/* Tasks grouped by time of day */}
      <div className="flex-1 overflow-auto space-y-4">
        {["morning", "afternoon", "evening"].map((timeOfDay) => (
          <div key={timeOfDay} className="glass-card">
            <h3 className="text-lg font-semibold mb-3 capitalize text-secondary">{timeOfDay}</h3>
            <div className="space-y-2">
              {timeOfDayGroups[timeOfDay as keyof typeof timeOfDayGroups].length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No tasks yet</p>
              ) : (
                timeOfDayGroups[timeOfDay as keyof typeof timeOfDayGroups].map((task) => (
                  <div
                    key={task._id?.toString()}
                    className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition group"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task._id?.toString() || "", task.completed)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span
                      className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task._id?.toString() || "")}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Daily notes */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-3">Daily Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            fetch(`/api/planner?date=${format(date, "yyyy-MM-dd")}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notes }),
            })
          }}
          
          placeholder="Add notes for the day..."
          className="w-full h-24 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
        />
      </div>
    </div>
  )
}
