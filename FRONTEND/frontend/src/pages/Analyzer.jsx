"use client"

import { useState } from "react"
import { Upload, LinkIcon, Play, Pause, Music } from "lucide-react"
import { Button } from "../components/UI/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/UI/card"
import { Input } from "../components/UI/input"
import BottomNav from "../components/bottomnav"

const dummyChords = ["Am", "F", "C", "G", "Em", "Dm"]
const dummyLyrics = [
  { time: "0:00", chord: "Am", lyric: "Sample lyric line with chord progression" },
  { time: "0:08", chord: "F", lyric: "Another line showing timing and chords" },
  { time: "0:15", chord: "C", lyric: "Demonstrating the analysis feature" },
  { time: "0:22", chord: "G", lyric: "With synchronized chord changes" },
]

export default function AnalyzerPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [uploadMethod, setUploadMethod] = useState("file")
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [formData, setFormData] = useState({
    audioFile: null,
    songUrl: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFormData(prev => ({ ...prev, audioFile: file }))
  }

  const handleUrlChange = (event) => {
    setFormData(prev => ({ ...prev, songUrl: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setHasAnalyzed(true)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnalyze = () => {
    setHasAnalyzed(true)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">Song Analyzer</h1>
        <p className="text-muted-foreground mt-1">Upload a song to get AI-powered chord analysis</p>
      </div>

      {!hasAnalyzed ? (
        /* Upload Section */
        <div className="px-6 space-y-6">
          {/* Upload Method Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              type="button"
              variant={uploadMethod === "file" ? "default" : "ghost"}
              className="flex-1"
              onClick={() => setUploadMethod("file")}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button
              type="button"
              variant={uploadMethod === "url" ? "default" : "ghost"}
              className="flex-1"
              onClick={() => setUploadMethod("url")}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              From URL
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {uploadMethod === "file" ? (
              <Card className="border-2 border-dashed border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Drop your audio file here</h3>
                  <p className="text-muted-foreground mb-4">Supports MP3, WAV, M4A files</p>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept=".mp3,.wav,.m4a,.aac,.flac"
                      onChange={handleFileChange}
                      className="hidden"
                      id="audio-file-input"
                      required={uploadMethod === "file"}
                    />
                    <label htmlFor="audio-file-input">
                      <Button type="button" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                    {formData.audioFile && (
                      <p className="text-sm text-primary">
                        Selected: {formData.audioFile.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Input 
                  type="url"
                  placeholder="Paste YouTube or Spotify URL here..." 
                  className="h-12"
                  value={formData.songUrl}
                  onChange={handleUrlChange}
                  required={uploadMethod === "url"}
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={isSubmitting || (uploadMethod === "file" && !formData.audioFile) || (uploadMethod === "url" && !formData.songUrl)}
            >
              {isSubmitting ? "Analyzing..." : "Analyze Song"}
            </Button>
          </form>
        </div>
      ) : (
        /* Analysis Results */
        <div className="px-6 space-y-6">
          {/* Song Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sample Song - Demo Artist</CardTitle>
              <p className="text-muted-foreground">Analysis complete</p>
            </CardHeader>
          </Card>

          {/* Chord Progression */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Chord Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {dummyChords.map((chord, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary font-semibold py-3 px-4 rounded-lg text-center"
                  >
                    {chord}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strumming Pattern */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Strumming Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 text-2xl">
                <span>↓</span>
                <span>↓</span>
                <span>↑</span>
                <span>↓</span>
                <span>↑</span>
                <span>↓</span>
                <span>↑</span>
              </div>
              <p className="text-center text-muted-foreground mt-2">Down-Down-Up-Down-Up-Down-Up</p>
            </CardContent>
          </Card>

          {/* Lyrics with Chords */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Lyrics & Chords</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyLyrics.map((line, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{line.time}</span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-semibold">
                        {line.chord}
                      </span>
                    </div>
                    <p className="text-foreground">{line.lyric}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
