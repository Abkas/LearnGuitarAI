import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { verifyToken } from "../utility/userApi";
import TopNav from "../components/topnav";
import BottomNav from "../components/bottomnav";

import { updateUser } from "../utility/userApi";

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { isValid, user, error } = await verifyToken();
        if (isValid && user) {
          setUser(user);
          setEditName(user.username || "");
          toast.success("User data loaded");
        } else {
          toast.error(error || "Failed to load user data");
        }
      } catch (err) {
        toast.error(err.message || "Error loading user data");
      }
      setLoading(false);
    }
    fetchUserData();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (editPassword && editPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    try {
      await updateUser({
        username: editName,
        password: editPassword || undefined,
      });
      toast.success("Profile updated");
      setUser({ ...user, username: editName });
      setEditPassword("");
      setEditMode(false);
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-20 relative">
      <TopNav />
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-white via-background to-primary/10 border-2 border-primary rounded-3xl p-8 shadow-2xl z-10 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary font-[family-name:var(--font-playfair)] tracking-tight flex items-center gap-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-accent mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            My Account
          </h1>
          {!loading && user && !editMode && (
            <button
              className="ml-2 px-3 py-1 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition flex items-center gap-1"
              onClick={() => setEditMode(true)}
              title="Edit"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6v-2a2 2 0 012-2h2" /></svg>
              Edit
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-primary text-lg font-semibold animate-pulse">Loading your account...</span>
          </div>
        ) : user ? (
          <div className="bg-white/80 border border-primary/30 rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="w-full text-center">
              {editMode ? (
                <form className="space-y-4" onSubmit={handleSave}>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={editPassword}
                      onChange={e => setEditPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-primary text-white font-bold shadow hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-200 text-primary font-bold shadow hover:bg-gray-300 focus:outline-none"
                      onClick={() => { setEditMode(false); setEditName(user.username); setEditPassword(""); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="text-xl font-bold text-primary mb-2">{user.username}</div>
                  <div className="text-base text-accent mb-4">{user.email}</div>
                  <div className="flex flex-col gap-2 items-center">
                    <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold w-fit">Plan: <span className="text-accent font-bold">{user.plan}</span></div>
                    <div className="px-4 py-2 rounded-lg bg-accent/10 text-accent font-semibold w-fit">Progress: <span className="text-primary font-bold">{user.progress_level}</span></div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <span className="text-red-500 text-lg font-semibold">No user data found.</span>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

