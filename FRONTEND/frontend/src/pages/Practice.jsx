
// import { useState } from "react"
// import { Camera, Play, Pause, RotateCcw } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { BottomNav } from "@/components/bottom-nav"

// export default function PracticePage() {
//   const [isRecording, setIsRecording] = useState(false)
//   const [currentChord, setCurrentChord] = useState("Am")
//   const [accuracy, setAccuracy] = useState(78)
//   const [isCorrect, setIsCorrect] = useState(true)

//   return (
//     <div className="min-h-scareen bg-background pb-20">
//       {/* Header */}
//       <div className="px-6 pt-12 pb-6">
//         <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">Practice Mode</h1>
//         <p className="text-muted-foreground mt-1">Real-time guitar chord detection</p>
//       </div>

//       <div className="px-6 space-y-6">
//         {/* Camera Preview */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg flex items-center">
//               <Camera className="h-5 w-5 mr-2" />
//               Camera View
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
//               <div className="relative z-10 text-center">
//                 <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
//                 <p className="text-muted-foreground">{isRecording ? "Recording your guitar..." : "Camera ready"}</p>
//               </div>
//               {isRecording && (
//                 <div className="absolute top-4 right-4 w-3 h-3 bg-destructive rounded-full animate-pulse" />
//               )}
//             </div>
//             <div className="flex justify-center mt-4">
//               <Button
//                 onClick={() => setIsRecording(!isRecording)}
//                 variant={isRecording ? "destructive" : "default"}
//                 size="lg"
//               >
//                 {isRecording ? (
//                   <>
//                     <Pause className="h-4 w-4 mr-2" />
//                     Stop Practice
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-4 w-4 mr-2" />
//                     Start Practice
//                   </>
//                 )}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Practice Song */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg">Practice Song</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="font-semibold">Yesterday - The Beatles</h3>
//                 <p className="text-sm text-muted-foreground">Beginner Level</p>
//               </div>
//               <Button variant="outline" size="sm">
//                 <RotateCcw className="h-4 w-4 mr-2" />
//                 Restart
//               </Button>
//             </div>

//             {/* Chord Sequence */}
//             <div className="space-y-2">
//               <p className="text-sm text-muted-foreground">Next chords:</p>
//               <div className="flex space-x-2">
//                 {["Am", "F", "C", "G"].map((chord, index) => (
//                   <div
//                     key={index}
//                     className={`px-3 py-2 rounded-lg font-semibold ${
//                       index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
//                     }`}
//                   >
//                     {chord}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <BottomNav />
//     </div>
//   )
// }
