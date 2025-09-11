import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "../components/UI/input";
import { Button } from "../components/UI/button";
// import BackButton from "../components/UI/BackButton";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: replace with real auth API
      await new Promise((r) => setTimeout(r, 600));
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-background via-background to-muted/30 relative">
  {/* <BackButton /> */}
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          New here? <Link to="/signup" className="text-primary underline-offset-4 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}


