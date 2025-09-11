import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/UI/input";
import { Button } from "../components/UI/button";

export default function Account() {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-background via-background to-muted/30 relative">
  {/* <BackButton /> */}
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <div className="text-sm text-muted-foreground">
            {isLogin ? (
              <span>
                New here? {" "}
                <button className="text-primary underline-offset-4 hover:underline" onClick={() => setMode("signup")}>Sign up</button>
              </span>
            ) : (
              <span>
                Have an account? {" "}
                <button className="text-primary underline-offset-4 hover:underline" onClick={() => setMode("login")}>Sign in</button>
              </span>
            )}
          </div>
        </div>

        {isLogin ? <LoginForm /> : <SignupForm />}

        <p className="text-xs text-muted-foreground mt-6 text-center">
          By continuing, you agree to our terms.
        </p>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Or go to your <Link to="/profile" className="text-primary underline-offset-4 hover:underline">profile</Link>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      // Replace with navigation and auth state
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
        <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
        <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
    </form>
  );
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      // Replace with navigation and auth state
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Name</label>
        <Input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
        <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
        <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Sign up"}</Button>
    </form>
  );
}


