
import { useState } from "react"
import { Camera, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "../components/UI/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/UI/card"
import { Input } from "../components/UI/input"
import BottomNav from "../components/bottomnav"
// import BackButton from "../components/UI/BackButton"

export default function PracticePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [formValues, setFormValues] = useState({ song: "", difficulty: "beginner" })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSetupSubmit = (event) => {
    event.preventDefault()
    // Simulate applying setup before starting
    setIsRecording(false)
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative">
  {/* <BackButton /> */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">Practice Mode</h1>
        <p className="text-muted-foreground mt-1">Real-time guitar chord detection</p>
      </div>

      <div className="px-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Session Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSetupSubmit}>
              <div className="sm:col-span-1">
                <label className="block text-sm text-muted-foreground mb-1" htmlFor="song">Song</label>
                <Input id="song" name="song" placeholder="e.g. Yesterday - The Beatles" value={formValues.song} onChange={handleChange} />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm text-muted-foreground mb-1" htmlFor="difficulty">Difficulty</label>
                <select id="difficulty" name="difficulty" value={formValues.difficulty} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit">Apply</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Camera className="h-5 w-5 mr-2" />
              Camera View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="relative z-10 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">{isRecording ? "Recording your guitar..." : "Camera ready"}</p>
              </div>
              {isRecording && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex justify-center mt-4 gap-3">
              <Button
                onClick={() => setIsRecording(!isRecording)}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
              >
                {isRecording ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Practice
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setIsRecording(false)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
