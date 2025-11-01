import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyToken, logout } from "../utility/userApi";

export default function TopNav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { isValid, user } = await verifyToken();
      setUser(isValid ? user : null);
    }
    // Check auth only when component mounts
    checkAuth();
  }, [])

  function handleLogout() {
    logout()
  }

  return (
    <nav
      className="w-full flex items-center justify-end px-8 py-2 mb-2"
      style={{ minHeight: '48px', background: 'none', border: 'none', boxShadow: 'none' }}
      aria-label="Main Navigation"
    >
      {!user ? (
        <Link to="/login" onClick={() => window.sessionStorage.setItem('prevLocation', window.location.pathname)}>
          <button
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold shadow transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Login"
          >
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-3 relative">
          <span className="text-primary font-semibold">Welcome, {user.username || "User"}</span>
          <button
            className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg focus:outline-none"
            onClick={() => setShowMenu((v) => !v)}
            aria-label="User menu"
          >
            {user.username ? user.username[0].toUpperCase() : "U"}
          </button>
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white border rounded shadow p-2 z-10">
              <button
                className="bg-red-600 text-white font-semibold px-4 py-2 hover:bg-red-700 w-full text-left transition-colors"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}