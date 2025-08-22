import { Navigation } from '@/components/navigation'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Leaderboard</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Top palindrome collectors and their amazing finds
          </p>
          <div className="bg-card rounded-lg p-8 shadow border">
            <p className="text-muted-foreground">Leaderboard coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
