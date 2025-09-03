
// import { Award } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { BottomNav } from "@/components/bottom-nav"

// const accuracyData = [
//   { day: "Mon", accuracy: 65 },
//   { day: "Tue", accuracy: 72 },
//   { day: "Wed", accuracy: 68 },
//   { day: "Thu", accuracy: 78 },
//   { day: "Fri", accuracy: 82 },
//   { day: "Sat", accuracy: 85 },
//   { day: "Sun", accuracy: 88 },
// ]

// const practiceData = [
//   { day: "Mon", minutes: 15 },
//   { day: "Tue", minutes: 22 },
//   { day: "Wed", minutes: 18 },
//   { day: "Thu", minutes: 35 },
//   { day: "Fri", minutes: 28 },
//   { day: "Sat", minutes: 42 },
//   { day: "Sun", minutes: 38 },
// ]

// const recentSessions = [
//   { date: "2024-01-15", song: "Yesterday - The Beatles", score: 88, duration: "12 min" },
//   { date: "2024-01-14", song: "Wonderwall - Oasis", score: 82, duration: "18 min" },
//   { date: "2024-01-13", song: "House of the Rising Sun", score: 75, duration: "15 min" },
//   { date: "2024-01-12", song: "Blackbird - The Beatles", score: 91, duration: "20 min" },
// ]

// const achievements = [
//   { icon: "🔥", title: "7-Day Streak", description: "Practiced every day this week" },
//   { icon: "🎯", title: "First 100 Chords", description: "Mastered 100 different chords" },
//   { icon: "⭐", title: "Perfect Score", description: "Achieved 100% accuracy" },
//   { icon: "🎸", title: "Song Master", description: "Completed 10 songs" },
// ]

// export default function ProgressPage() {
//   return (
//     <div className="min-h-screen bg-background pb-20">
//       {/* Header */}
//       <div className="px-6 pt-12 pb-6">
//         <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">Your Progress</h1>
//         <p className="text-muted-foreground mt-1">Track your guitar learning journey</p>
//       </div>

//       <div className="px-6 space-y-6">
//         {/* Stats Overview */}
//         <div className="grid grid-cols-2 gap-4">
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-primary mb-1">88%</div>
//               <div className="text-sm text-muted-foreground">Avg Accuracy</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-primary mb-1">7</div>
//               <div className="text-sm text-muted-foreground">Day Streak</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-primary mb-1">198</div>
//               <div className="text-sm text-muted-foreground">Total Minutes</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-primary mb-1">12</div>
//               <div className="text-sm text-muted-foreground">Songs Learned</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Achievements */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg flex items-center">
//               <Award className="h-5 w-5 mr-2" />
//               Achievements
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-3">
//               {achievements.map((achievement, index) => (
//                 <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
//                   <div className="text-2xl mb-2">{achievement.icon}</div>
//                   <h4 className="font-semibold text-sm text-foreground mb-1">{achievement.title}</h4>
//                   <p className="text-xs text-muted-foreground leading-relaxed">{achievement.description}</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <BottomNav />
//     </div>
//   )
// }
