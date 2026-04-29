import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl mb-4 font-serif">404</div>
        <h1 className="text-2xl font-serif font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-opacity-90 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
