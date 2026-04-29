"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, CheckSquare, BookOpen, Activity, BarChart3 } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Calendar },
  { href: "/dashboard/planner", label: "Planner", icon: CheckSquare },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpen },
  { href: "/dashboard/habits", label: "Habits", icon: Activity },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-border p-6 gap-8">
      <div className="text-center">
        <div className="text-4xl mb-2">📔</div>
        <h2 className="font-serif text-xl font-bold text-sidebar-foreground">Planner</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-6 border-t border-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">© 2025 Daily Planner</p>
      </div>
    </aside>
  )
}
