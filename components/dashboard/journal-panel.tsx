"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Heart, Sparkles } from "lucide-react"
import type { JournalEntry } from "@/lib/schemas"

interface JournalPanelProps {
  date: Date
  onDateChange: (date: Date) => void
}

const moodEmojis = ["😢", "😕", "😐", "🙂", "😊", "😄", "🤩"]

export function JournalPanel({ date, onDateChange }: JournalPanelProps) {
  const [entry, setEntry] = useState<Partial<JournalEntry>>({
    affirmation: "",
    gratitude: [],
    highlights: [],
    reflection: "",
    mood: "🙂",
  })
  const [currentGratitude, setCurrentGratitude] = useState("")
  const [currentHighlight, setCurrentHighlight] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJournalEntry()
  }, [date])

  const fetchJournalEntry = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/journal?date=${format(date, "yyyy-MM-dd")}`)
      if (response.ok) {
        const data = await response.json()
        setEntry(
          data || {
            affirmation: "",
            gratitude: [],
            highlights: [],
            reflection: "",
            mood: "🙂",
          },
        )
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveEntry = async () => {
    try {
      await fetch(`/api/journal?date=${format(date, "yyyy-MM-dd")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          date: format(date, "yyyy-MM-dd"),
        }),
      })
    } catch (error) {
      console.error("Error saving journal entry:", error)
    }
  }

  const handleAddGratitude = () => {
    if (!currentGratitude.trim()) return
    setEntry((prev) => ({
      ...prev,
      gratitude: [...(prev.gratitude || []), currentGratitude],
    }))
    setCurrentGratitude("")
    saveEntry()
  }

  const handleAddHighlight = () => {
    if (!currentHighlight.trim()) return
    setEntry((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), currentHighlight],
    }))
    setCurrentHighlight("")
    saveEntry()
  }

  const handleRemoveGratitude = (index: number) => {
    setEntry((prev) => ({
      ...prev,
      gratitude: prev.gratitude?.filter((_, i) => i !== index),
    }))
    saveEntry()
  }

  const handleRemoveHighlight = (index: number) => {
    setEntry((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index),
    }))
    saveEntry()
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="glass-card">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">Daily Journal</h2>
          <div className="flex gap-2">
            {moodEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setEntry((prev) => ({ ...prev, mood: emoji }))
                  saveEntry()
                }}
                className={`text-2xl p-2 rounded-lg transition ${
                  entry.mood === emoji ? "ring-2 ring-secondary bg-secondary/20" : "hover:bg-muted"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Affirmation */}
      <div className="glass-card">
        <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-secondary">
          <Sparkles size={18} />
          Daily Affirmation
        </label>
        <input
          type="text"
          value={entry.affirmation || ""}
          onChange={(e) => setEntry((prev) => ({ ...prev, affirmation: e.target.value }))}
          onBlur={saveEntry}
          placeholder="e.g., I am capable and worthy of success..."
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      {/* Gratitude */}
      <div className="glass-card">
        <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-secondary">
          <Heart size={18} />
          I'm grateful for...
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentGratitude}
            onChange={(e) => setCurrentGratitude(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddGratitude()}
            placeholder="What are you grateful for?"
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
          />
          <button
            onClick={handleAddGratitude}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-opacity-90 transition text-sm"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {entry.gratitude?.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-background rounded-lg group">
              <span className="text-sm">{item}</span>
              <button
                onClick={() => handleRemoveGratitude(i)}
                className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 hover:bg-destructive/10 text-destructive rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="glass-card">
        <label className="block text-sm font-semibold text-secondary mb-2">Highlights of the day</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={currentHighlight}
            onChange={(e) => setCurrentHighlight(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddHighlight()}
            placeholder="What went well today?"
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
          />
          <button
            onClick={handleAddHighlight}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-opacity-90 transition text-sm"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {entry.highlights?.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-background rounded-lg group">
              <span className="text-sm">{item}</span>
              <button
                onClick={() => handleRemoveHighlight(i)}
                className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 hover:bg-destructive/10 text-destructive rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reflection */}
      <div className="glass-card flex-1 flex flex-col">
        <label className="block text-sm font-semibold text-secondary mb-2">Reflection</label>
        <textarea
          value={entry.reflection || ""}
          onChange={(e) => setEntry((prev) => ({ ...prev, reflection: e.target.value }))}
          onBlur={saveEntry}
          placeholder="How are you feeling? What's on your mind?"
          className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
        />
      </div>
    </div>
  )
}
