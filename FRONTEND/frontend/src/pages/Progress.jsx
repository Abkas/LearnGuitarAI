
import { useState } from "react"
import { Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/UI/card"
import { Input } from "../components/UI/input"
import { Button } from "../components/UI/button"
import BottomNav from "../components/bottomnav"
import BackButton from "../components/UI/BackButton"

const achievements = [
  { icon: "🔥", title: "7-Day Streak", description: "Practiced every day this week" },
  { icon: "🎯", title: "First 100 Chords", description: "Mastered 100 different chords" },
  { icon: "⭐", title: "Perfect Score", description: "Achieved 100% accuracy" },
  { icon: "🎸", title: "Song Master", description: "Completed 10 songs" },
]

export default function ProgressPage() {
  const [filters, setFilters] = useState({ from: "", to: "", weeklyGoal: 120 })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Simulate filter apply
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <BackButton />
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">Your Progress</h1>
        <p className="text-muted-foreground mt-1">Track your guitar learning journey</p>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters & Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-muted-foreground mb-1" htmlFor="from">From</label>
                <Input id="from" name="from" type="date" value={filters.from} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1" htmlFor="to">To</label>
                <Input id="to" name="to" type="date" value={filters.to} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1" htmlFor="weeklyGoal">Weekly goal (min)</label>
                <Input id="weeklyGoal" name="weeklyGoal" type="number" min="0" value={filters.weeklyGoal} onChange={handleChange} />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <Button type="submit">Apply</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">88%</div>
              <div className="text-sm text-muted-foreground">Avg Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">7</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">198</div>
              <div className="text-sm text-muted-foreground">Total Minutes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Songs Learned</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
