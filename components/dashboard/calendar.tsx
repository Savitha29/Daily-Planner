"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth } from "date-fns"

interface CalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(prevMonth)} className="p-2 hover:bg-muted rounded-lg transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentMonth(nextMonth)} className="p-2 hover:bg-muted rounded-lg transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isSelected = day.toDateString() === selectedDate.toDateString()
          const isCurrentMonth = isSameMonth(day, currentMonth)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`aspect-square rounded-lg text-sm font-medium transition ${
                isSelected
                  ? "bg-secondary text-secondary-foreground ring-2 ring-secondary"
                  : isCurrentMonth
                    ? "bg-muted hover:bg-secondary/30"
                    : "text-muted-foreground opacity-50"
              }`}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
}
