import { Link } from "react-router-dom";
import TopNav from "../components/topnav";
// import BackButton from "../components/UI/BackButton";

export default function Profile() {
  // Placeholder static data; replace with real user context later
  const user = {
    name: "Guitarist",
    email: "you@example.com",
    joined: "2025-01-01",
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-background via-background to-muted/30 relative">
      <TopNav />
      {/* <BackButton /> */}
      <div className="max-w-xl mx-auto bg-card border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-foreground">Your Profile</h1>
          <Link to="/account" className="text-sm text-primary underline-offset-4 hover:underline">Manage account</Link>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="text-foreground font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since</span>
            <span className="text-foreground font-medium">{user.joined}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


