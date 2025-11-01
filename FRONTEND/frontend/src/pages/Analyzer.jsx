import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, LinkIcon, Play, Pause, Music } from "lucide-react"
import { Button } from "../components/UI/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/UI/card"
import { Input } from "../components/UI/input"
import BottomNav from "../components/bottomnav"
import TopNav from "../components/topnav"
import { uploadSong, uploadSongFromUrl } from "../utility/songApi";
import toast from 'react-hot-toast'

export default function AnalyzerPage() {
  const [uploadMethod, setUploadMethod] = useState("file")
  const [formData, setFormData] = useState({
    audioFile: null,
    songUrl: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setFormData(prev => ({ ...prev, audioFile: file }))
  }

  const handleUrlChange = (event) => {
    setFormData(prev => ({ ...prev, songUrl: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      
      if (uploadMethod === "file" && formData.audioFile) {
        response = await uploadSong(formData.audioFile)
      } else if (uploadMethod === "url" && formData.songUrl) {
        response = await uploadSongFromUrl(formData.songUrl)
      }

      // If upload successful, show success toast and navigate
      if (response?.song_info?.id) {
        toast.success('Song uploaded successfully!')
        navigate("/analyzer-result", { 
          state: { 
            songId: response.song_info.id,
            title: response.song_info.title
          } 
        });
      }

    } catch (error) {
      console.error("Upload failed:", error)
      toast.error(error.message || 'Failed to upload song. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {<TopNav/>}
  {/* <BackButton /> */}
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">Song Analyzer</h1>
        <p className="text-muted-foreground mt-1">Upload a song to get AI-powered chord analysis</p>
      </div>

      {/* Upload Section */}
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

      <BottomNav />

      <BottomNav />
    </div>
  )
}
