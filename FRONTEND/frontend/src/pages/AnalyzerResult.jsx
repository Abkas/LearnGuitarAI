import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/UI/button";
import { Card } from "../components/UI/card";
import BackButton from "../components/UI/BackButton";
import { getSongLyrics } from "../utility/songApi";
import toast from "react-hot-toast";

export default function AnalyzerResult() {
  const location = useLocation();
  const { songId, title } = location.state || {};
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  
  const audioRef = useRef(null);

  // Fetch lyrics on component mount
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const response = await getSongLyrics(songId);
        setLyrics(response.lyrics);
      } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        toast.error("Failed to load lyrics");
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchLyrics();
    }
  }, [songId]);

  // Update current time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Sync lyrics with current time
  useEffect(() => {
    if (!lyrics?.segments) return;

    const currentIndex = lyrics.segments.findIndex((segment, index) => {
      const nextSegment = lyrics.segments[index + 1];
      return currentTime >= segment.start && (!nextSegment || currentTime < nextSegment.start);
    });

    if (currentIndex !== -1) {
      setCurrentLyricIndex(currentIndex);
    }
  }, [currentTime, lyrics]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressBarWidth) * duration;
    audio.currentTime = newTime;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get current chord (placeholder for now)
  const currentChord = "C"; // TODO: Get from chord analysis

  return (
    <div className="min-h-screen bg-background pb-32 relative flex flex-col">
      <BackButton />
      
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
          {title || "Song Analysis"}
        </h1>
        <p className="text-muted-foreground mt-1">Now Playing</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 space-y-4">
        
        {/* Lyrics Display - Large Box */}
        <Card className="flex-1 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
          <div className="text-center px-8 max-w-2xl">
            {loading ? (
              <p className="text-muted-foreground animate-pulse">Loading lyrics...</p>
            ) : lyrics?.segments?.length > 0 ? (
              <>
                {/* Previous line - faded */}
                {currentLyricIndex > 0 && (
                  <p className="text-muted-foreground/40 text-lg mb-4 transition-all duration-300">
                    {lyrics.segments[currentLyricIndex - 1].text}
                  </p>
                )}
                
                {/* Current line - highlighted */}
                <p className="text-foreground text-3xl md:text-4xl font-semibold leading-relaxed transition-all duration-300">
                  {lyrics.segments[currentLyricIndex]?.text || "♪"}
                </p>
                
                {/* Next line - faded */}
                {currentLyricIndex < lyrics.segments.length - 1 && (
                  <p className="text-muted-foreground/40 text-lg mt-4 transition-all duration-300">
                    {lyrics.segments[currentLyricIndex + 1].text}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No lyrics available</p>
            )}
          </div>
        </Card>

        {/* Chord Display */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Current Chord</p>
            <div className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-xl text-4xl font-bold shadow-lg">
              {currentChord}
            </div>
          </div>
        </Card>
      </div>

      {/* Music Player Controls - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl">
        <div className="px-6 py-4 space-y-4">
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              className="w-full h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-12 w-12"
              onClick={() => skipTime(-5)}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button 
              size="icon" 
              className="h-16 w-16 rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>

            <Button 
              size="icon" 
              variant="outline" 
              className="h-12 w-12"
              onClick={() => skipTime(5)}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={`http://localhost:8000/songs/${songId}/audio`} />
    </div>
  );
}