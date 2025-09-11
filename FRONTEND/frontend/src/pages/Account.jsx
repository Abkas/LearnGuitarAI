import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/UI/input";
import { Button } from "../components/UI/button";
import TopNav from "../components/topnav";
import BottomNav from "../components/bottomnav";

export default function Account() {
  // Mock user data for form
  const [name, setName] = useState("Ava Guitarist");
  const [email, setEmail] = useState("ava.guitarist@example.com");
  const [plan, setPlan] = useState("Pro");
  const [progress, setProgress] = useState("Level 7 - Intermediate");
  const [saving, setSaving] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-20 relative">
      <TopNav />
      <div className="w-full max-w-md mx-auto bg-white border-2 border-primary rounded-2xl p-8 shadow-2xl z-10 mt-8">
        <h1 className="text-2xl font-bold text-primary mb-6 font-[family-name:var(--font-playfair)]">Account Details</h1>
        <form className="space-y-6" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Plan</label>
            <select
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={plan}
              onChange={e => setPlan(e.target.value)}
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-primary">Progress</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={progress}
              onChange={e => setProgress(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full py-2 rounded-lg bg-primary text-white font-bold shadow transition duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}

