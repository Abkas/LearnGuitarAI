import { Upload, Play, Music, Camera, TrendingUp, Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "../components/UI/card";
import Bottomnav from "../components/bottomnav";
import { Link, useNavigate } from "react-router-dom";

const features = [
  {
    icon: Music,
    title: "Song Analyzer",
    description: "AI-powered chord and lyrics detection from any song",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Play,
    title: "Karaoke Mode",
    description: "Practice with synchronized lyrics and chords",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Camera,
    title: "Real-time Feedback",
    description: "Computer vision tracks your guitar playing",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracker",
    description: "Monitor your improvement with detailed analytics",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export default function HomePage() {
  
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-20 relative">
      <div className="px-6 pt-16 pb-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Music className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3 font-[family-name:var(--font-playfair)] text-balance">
          GuitarVision
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
          Master guitar with AI-powered learning and real-time feedback
        </p>

      </div>

      <div className="px-6 mb-10 space-y-4">
        <Link to="/analyzer" className="block">
          <Card className="gradient-primary border-0 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-white">Upload Song</h3>
                    <Zap className="h-4 w-4 text-yellow-300" />
                  </div>
                  <p className="text-white/90 leading-relaxed">Auto chord & lyrics generation with AI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/practice" className="block">
          <Card className="bg-card hover:bg-accent/5 transition-all duration-300 border border-border shadow-soft hover:shadow-glow hover:scale-[1.01]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center">
                  <Play className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1">Start Practice Mode</h3>
                  <p className="text-muted-foreground leading-relaxed">Real-time guitar feedback & coaching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="px-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-foreground font-[family-name:var(--font-playfair)]">
            App Features
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="bg-card border border-border shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-5 text-center">
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm leading-tight">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

  <Bottomnav />
    </div>
  )
}