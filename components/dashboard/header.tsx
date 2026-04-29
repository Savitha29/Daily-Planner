"use client"

import type { Session } from "next-auth"
import { useState } from "react"
import { signOut } from "next-auth/react"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface HeaderProps {
  user?: Session["user"]
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-serif">📔</div>
          <h1 className="text-2xl font-serif font-bold text-primary">Daily Planner</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <img
              src={user?.image || "https://via.placeholder.com/40"}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:bg-opacity-90 transition"
          >
            Sign out
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}
