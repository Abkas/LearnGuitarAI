import { ArrowLeft, Camera, TrendingUp, Upload } from 'lucide-react'
import { createElement } from 'react'
import { Link, Routes as RouterRoutes, Route } from 'react-router-dom'
import HomePage from '../Pages/Homepage'
import Bottomnav from '../components/bottomnav'

function FeaturePage({ icon: PageIcon, title, description, action }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 px-6 pb-24">
            <header className="mx-auto flex max-w-md items-center gap-3 pt-10 pb-8">
                <Link
                    to="/"
                    aria-label="Back to home"
                    className="rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
            </header>

            <main className="mx-auto max-w-md">
                <section className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                    <div className="gradient-primary mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                        {createElement(PageIcon, { className: 'h-8 w-8 text-white' })}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">{action}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        This workspace is ready for your next guitar session.
                    </p>
                    <button className="gradient-primary mt-6 w-full rounded-xl px-5 py-3 font-semibold text-white shadow-soft transition-transform hover:scale-[1.01]">
                        Get started
                    </button>
                </section>
            </main>

            <Bottomnav />
        </div>
    )
}

const AppRoutes = () => {
  return (
        <RouterRoutes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/analyzer"
                element={
                    <FeaturePage
                        icon={Upload}
                        title="Song Analyzer"
                        description="Turn a song into chords and lyrics."
                        action="Analyze a song"
                    />
                }
            />
            <Route
                path="/practice"
                element={
                    <FeaturePage
                        icon={Camera}
                        title="Practice Mode"
                        description="Build accuracy with real-time coaching."
                        action="Start a practice session"
                    />
                }
            />
            <Route
                path="/progress"
                element={
                    <FeaturePage
                        icon={TrendingUp}
                        title="Your Progress"
                        description="See how your playing is improving."
                        action="View your progress"
                    />
                }
            />
            <Route path="*" element={<HomePage />} />
        </RouterRoutes>
    )
}

export default AppRoutes