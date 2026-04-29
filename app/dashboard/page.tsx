"use client"

import { useState } from "react"
import { DailyPlannerPanel } from "@/components/dashboard/daily-planner-panel"
import { JournalPanel } from "@/components/dashboard/journal-panel"
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="h-full">
      {/* Split layout - Planner on left, Journal on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <DailyPlannerPanel date={selectedDate} onDateChange={setSelectedDate} />
        <JournalPanel date={selectedDate} onDateChange={setSelectedDate} />
      </div>
    </div>
  )
}
