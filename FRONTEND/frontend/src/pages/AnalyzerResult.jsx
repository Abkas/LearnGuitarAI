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
  const [chords, setChords] = useState(null);
  const [strumming, setStrumming] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [currentStrumIndex, setCurrentStrumIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  
  const audioRef = useRef(null);

  // Fetch lyrics, chords, and strumming on component mount
  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);
        const response = await getSongLyrics(songId);
        setLyrics(response.lyrics);
        setChords(response.chords);
        setStrumming(response.strumming);
        setAudioUrl(response.audio_url || "");
        toast.success("Song data loaded!");
      } catch (error) {
        console.error("Failed to fetch song data:", error);
        toast.error("Failed to load song data");
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
    if (!audio || !audioUrl) return;

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
  }, [audioUrl]);

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

  // Sync chords with current time
  useEffect(() => {
    if (!chords?.segments) return;

    const currentIndex = chords.segments.findIndex((segment, index) => {
      const nextSegment = chords.segments[index + 1];
      return currentTime >= segment.start && (!nextSegment || currentTime < nextSegment.start);
    });

    if (currentIndex !== -1) {
      setCurrentChordIndex(currentIndex);
    }
  }, [currentTime, chords]);

  // Sync strumming pattern with current time
  useEffect(() => {
    if (!strumming?.segments) return;

    const currentIndex = strumming.segments.findIndex((segment, index) => {
      const nextSegment = strumming.segments[index + 1];
      return currentTime >= segment.start && (!nextSegment || currentTime < nextSegment.start);
    });

    if (currentIndex !== -1) {
      setCurrentStrumIndex(currentIndex);
    }
  }, [currentTime, strumming]);

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

  // Get current and next chords
  const currentChord = chords?.segments?.[currentChordIndex]?.chord || "—";
  const nextChord = chords?.segments?.[currentChordIndex + 1]?.chord || "—";

  // Get current strumming pattern and convert to arrows
  const currentPattern = strumming?.segments?.[currentStrumIndex]?.pattern || "";
  const strumArray = currentPattern.split(" ").filter(s => s.length > 0);
  
  // Calculate which strum arrow should be highlighted based on time within segment
  const getCurrentStrumBeat = () => {
    if (!strumming?.segments?.[currentStrumIndex] || !strumming.bpm) return 0;
    
    const segment = strumming.segments[currentStrumIndex];
    const timeInSegment = currentTime - segment.start;
    const beatDuration = 60 / strumming.bpm; // Duration of one beat in seconds
    const beatsPerPattern = strumArray.length;
    const patternDuration = beatDuration * beatsPerPattern;
    
    // Calculate which beat we're on within the pattern
    const beatInPattern = Math.floor((timeInSegment % patternDuration) / beatDuration);
    return beatInPattern % beatsPerPattern;
  };

  const currentBeat = getCurrentStrumBeat();

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

        {/* Chord & Strumming Display - Combined */}
        <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-background">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-3">
            
            {/* Chord Circles */}
            <div className="flex items-center gap-4">
              {/* Current Chord Circle */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl transform transition-all duration-300 hover:scale-110">
                  <span className={`font-bold text-white text-center leading-tight ${
                    currentChord.length > 4 ? 'text-2xl md:text-3xl' : currentChord.length > 2 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
                  }`}>
                    {currentChord}
                  </span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 bg-green-500/20 rounded-full blur-sm"></div>
              </div>

              {/* Next Chord Circle */}
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-300 to-green-400 flex items-center justify-center shadow-lg transform transition-all duration-300">
                  <span className={`font-bold text-white text-center leading-tight ${
                    nextChord.length > 4 ? 'text-lg md:text-xl' : nextChord.length > 2 ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
                  }`}>
                    {nextChord}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-32 w-px bg-border"></div>
            <div className="block md:hidden w-full h-px bg-border"></div>

            {/* Strumming Pattern */}
            <div className="flex-1 text-center space-y-2 md:space-y-3">
              {strumming?.bpm && (
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {strumming.bpm} BPM
                  </p>
                </div>
              )}
              
              {/* Strumming Arrows */}
              <div className="flex items-center justify-center gap-2 md:gap-3">
                {strumArray.length > 0 ? (
                  strumArray.map((strum, index) => (
                    <div
                      key={index}
                      className={`text-3xl md:text-5xl font-bold transition-all duration-150 ${
                        currentBeat === index
                          ? "text-primary scale-125 md:scale-150 drop-shadow-2xl animate-pulse"
                          : "text-muted-foreground/30 scale-100"
                      }`}
                    >
                      {strum === "D" ? "↓" : strum === "U" ? "↑" : strum}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No pattern</p>
                )}
              </div>
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
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
}