import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { Input } from "../components/UI/input"
import { Button } from "../components/UI/button"
import { login } from "../utility/userApi"

export default function Login() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('/')
  useState(() => {
    const prev = window.sessionStorage.getItem('prevLocation')
    if (prev) setFrom(prev);
  }, []);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  try {
    const data = await login({ email, password })
    // Store the access token (for example, in localStorage)
    localStorage.setItem("access_token", data.access_token)
    navigate("/")
  } catch (err) {
    alert(err.message)
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Custom guitar SVG background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="1200" cy="200" rx="320" ry="80" fill="#fbbf24" fillOpacity="0.12" />
        <ellipse cx="300" cy="700" rx="400" ry="120" fill="#6366f1" fillOpacity="0.10" />
        <ellipse cx="900" cy="600" rx="200" ry="60" fill="#22d3ee" fillOpacity="0.10" />
        <rect x="600" y="400" width="240" height="16" rx="8" fill="#a3e635" fillOpacity="0.18" />
        <rect x="650" y="420" width="140" height="8" rx="4" fill="#f43f5e" fillOpacity="0.18" />
      </svg>
      <div className="w-full max-w-sm bg-white border-2 border-primary rounded-2xl p-8 shadow-2xl z-10 relative">
        <button
          type="button"
          onClick={() => navigate(from)}
          className="absolute top-3 right-3 text-primary hover:text-accent text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Close"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-playfair)]">Sign In</h1>
        <p className="text-base text-muted-foreground mb-8">Access your Guitarify account</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 rounded-lg bg-primary text-white font-bold shadow transition duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          New here? <Link to="/signup" className="text-accent font-semibold underline-offset-4 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}


